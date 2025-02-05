"use client"

import { useState, useEffect, useCallback } from "react"
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation, Loader2 } from "lucide-react"
import { getRouteSuggestion } from "../actions/get-route-suggestion"
import { Nav } from "../components/nav" // Updated import
import { WorldMapGrid } from "../components/world-map-grid"

interface Location {
  lat: number
  lng: number
}

interface RouteSegment {
  mode: string
  route: string
  cost: number
  duration: number
  safetyScore: number
  details: string
}

interface RouteSuggestion {
  segments: RouteSegment[]
  totalCost: number
  totalDuration: number
  safetyScore: number
}

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
}

const containerStyle = {
  width: "100%",
  height: "400px",
}

const mapOptions = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
  ],
}

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<Location>(defaultCenter)
  const [destination, setDestination] = useState<Location | null>(null)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [routeSuggestion, setRouteSuggestion] = useState<RouteSuggestion | null>(null)
  const [destinationAddress, setDestinationAddress] = useState("")
  const [currentAddress, setCurrentAddress] = useState("")
  const [manualCurrentLocation, setManualCurrentLocation] = useState<Location | null>(null)
  const [preference, setPreference] = useState<"safe" | "fast" | "cheap">("fast")
  const [aiGeneratedRoute, setAiGeneratedRoute] = useState<RouteSuggestion | null>(null)

  const geocodeAddress = async (address: string): Promise<Location | null> => {
    const geocoder = new google.maps.Geocoder()
    try {
      const response = await geocoder.geocode({ address })
      if (response.results[0]?.geometry?.location) {
        return {
          lat: response.results[0].geometry.location.lat(),
          lng: response.results[0].geometry.location.lng(),
        }
      }
    } catch (error) {
      console.error("Error geocoding address:", error)
    }
    return null
  }

  const updateRoute = useCallback(async () => {
    if (!destination || !manualCurrentLocation) return

    setLoading(true)
    setAiGeneratedRoute(null) // Clear AI-generated route
    try {
      const directionsService = new google.maps.DirectionsService()
      const result = await directionsService.route({
        origin: manualCurrentLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.TRANSIT,
      })
      setDirections(result)

      // Get route suggestion from LLM
      //const suggestion = await getRouteSuggestion(currentAddress, destinationAddress, preference)
      //setRouteSuggestion(suggestion)
    } catch (error) {
      console.error("Error getting directions:", error)
    } finally {
      setLoading(false)
    }
  }, [manualCurrentLocation, destination])

  useEffect(() => {
    if (destination) {
      updateRoute()
    }
  }, [destination, updateRoute])

  const handleDestinationChange = async (address: string) => {
    setDestinationAddress(address)
    const location = await geocodeAddress(address)
    if (location) {
      setDestination(location)
    }
  }

  const handleCurrentLocationChange = async (address: string) => {
    setCurrentAddress(address)
    const location = await geocodeAddress(address)
    if (location) {
      setManualCurrentLocation(location)
      setCurrentLocation(location)
    }
  }

  const handlePreferenceChange = (newPreference: "safe" | "fast" | "cheap") => {
    setPreference(newPreference)
    updateRoute()
  }

  const handleGenerateAIRoute = async () => {
    if (!currentAddress || !destinationAddress) return
    setLoading(true)
    try {
      const suggestion = await getRouteSuggestion(currentAddress, destinationAddress, preference)
      setAiGeneratedRoute(suggestion)
    } catch (error) {
      console.error("Error generating AI route:", error)
    } finally {
      setLoading(false)
    }
  }

  // Add loading handler
  const handleMapLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  // Add error handler
  const handleMapError = useCallback((error: Error) => {
    setLoadError(error.message)
    console.error("Error loading map:", error)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <WorldMapGrid />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-red-950/50 to-red-900/30" />
      <div className="relative">
        <Nav />
        <div className="p-4">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 space-y-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10 bg-black/50 text-white border-gray-800"
                    placeholder="Enter Current Location"
                    value={currentAddress}
                    onChange={(e) => handleCurrentLocationChange(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Navigation className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10 bg-black/50 text-white border-gray-800"
                    placeholder="Enter Destination"
                    value={destinationAddress}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Card className="overflow-hidden bg-black/50 border-gray-800">
              {loadError ? (
                <div className="flex items-center justify-center h-[400px] text-red-500">
                  Error loading map: {loadError}
                </div>
              ) : (
                <LoadScript
                  googleMapsApiKey="AIzaSyCM6w8q5ALYC3sEhHvzWgljvpwi78ZXBiY"
                  onLoad={handleMapLoad}
                  onError={handleMapError}
                >
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={manualCurrentLocation || currentLocation}
                    zoom={13}
                    options={mapOptions}
                    onLoad={handleMapLoad}
                  >
                    {isLoaded && (
                      <>
                        <Marker position={manualCurrentLocation || currentLocation} />
                        {destination && <Marker position={destination} />}
                        {directions && <DirectionsRenderer directions={directions} />}
                      </>
                    )}
                  </GoogleMap>
                </LoadScript>
              )}
            </Card>

            <div className="grid gap-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className={`flex-1 border-red-800 text-red-500 hover:bg-red-950 ${
                    preference === "safe" ? "bg-red-950" : ""
                  }`}
                  onClick={() => handlePreferenceChange("safe")}
                >
                  Safe
                </Button>
                <Button
                  variant="outline"
                  className={`flex-1 border-red-800 text-red-500 hover:bg-red-950 ${
                    preference === "fast" ? "bg-red-950" : ""
                  }`}
                  onClick={() => handlePreferenceChange("fast")}
                >
                  Fast
                </Button>
                <Button
                  variant="outline"
                  className={`flex-1 border-red-800 text-red-500 hover:bg-red-950 ${
                    preference === "cheap" ? "bg-red-950" : ""
                  }`}
                  onClick={() => handlePreferenceChange("cheap")}
                >
                  Cheap
                </Button>
              </div>
              <Button
                variant="default"
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={handleGenerateAIRoute}
                disabled={!currentAddress || !destinationAddress}
              >
                Generate AI Route
              </Button>

              <Card className="p-4 bg-black/50 border-gray-800 text-white">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                  </div>
                ) : aiGeneratedRoute ? (
                  <div className="space-y-3">
                    {aiGeneratedRoute.segments.map((segment, index) => (
                      <div key={index} className="flex flex-col border-b border-gray-800 pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">
                            {segment.mode}: {segment.route}
                          </span>
                          <span className="font-medium text-red-500">${segment.cost.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{segment.duration} mins</span>
                          <span>•</span>
                          <span>Safety: {segment.safetyScore}/10</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{segment.details}</p>
                      </div>
                    ))}
                    <div className="border-t border-gray-800 pt-2">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-medium text-gray-400">Total</span>
                          <div className="text-sm text-gray-500">
                            {aiGeneratedRoute.totalDuration} mins • Safety: {aiGeneratedRoute.safetyScore}/10
                          </div>
                        </div>
                        <span className="font-bold text-red-500">${aiGeneratedRoute.totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">Click "Generate AI Route" to see detailed suggestions</div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

