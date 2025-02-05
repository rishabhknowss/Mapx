import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WorldMapGrid } from "./components/world-map-grid"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <WorldMapGrid />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-red-950/50 to-red-900/30" />

      <div className="relative">
        <nav className="border-b border-red-800/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">
                  Map<span className="text-red-500">X</span>
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#safety" className="text-gray-300 hover:text-white transition-colors">
                  Safety
                </Link>
                <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                  Login
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <section className="container mx-auto px-4 py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="text-white">Google Maps</span>
                  <div className="text-white">But <span className="text-red-500"> Better</span></div>
                </h1>
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
                 Make your travel hustle free with AI Powered filtered routes and budget estimation
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/map">
                    {" "}
                    <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg">
                      Plan Your Route
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-6 text-lg"
                  >
                    See Features
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 opacity-20 blur-3xl rounded-full" />
                <div className="relative bg-black/40 backdrop-blur-sm rounded-xl border border-red-500/20 p-4">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zUW9HdumncqXY6M7jLMeNQWgUIMT4o.png"
                      alt="MapX Interface Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-24">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-red-500/20 p-8">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6">
                  <div></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Smart Navigation</h3>
                <p className="text-gray-400">
                  Get intelligent route suggestions based on your preferences for safety, speed, or cost-effectiveness.
                </p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-red-500/20 p-8">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6">
                  <div></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Real-time Updates</h3>
                <p className="text-gray-400">
                  Stay informed with live tracking and instant updates about your route and transportation options.
                </p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-red-500/20 p-8">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6">
                  <div></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">AI-Powered</h3>
                <p className="text-gray-400">
                  Benefit from our advanced AI system that learns and adapts to provide the best possible routes.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

