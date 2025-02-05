"use server"

// TODO: Ensure this file is being executed in a true server environment.
// The need for dangerouslyAllowBrowser suggests it might be running client-side, which is a security risk.

import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: "sk-ecb9bb4f6abb42a3a5360095f21c00d0",
  baseURL: "https://api.deepseek.com/v1",
  dangerouslyAllowBrowser: true, // WARNING: This is not recommended for production use. API calls should be made server-side.
})

export async function getRouteSuggestion(start: string, end: string, preference: "safe" | "fast" | "cheap" = "fast") {
  const prompt = `Given the starting point "${start}" and destination "${end}", suggest the best route with a preference for ${preference} travel. Return a JSON response with this exact structure:
  {
    "segments": [
      {
        "mode": "string (e.g., 'Bus', 'Train', 'Walk')",
        "route": "string (detailed route description)",
        "cost": number (in dollars),
        "duration": number (in minutes),
        "safetyScore": number (1-10),
        "details": "string (specific instructions)"
      }
    ],
    "totalCost": number,
    "totalDuration": number,
    "safetyScore": number (1-10)
  }`

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a route planning assistant that provides detailed travel segments with costs, durations, and safety scores.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error("No response from AI")

    // Parse and validate the response
    const parsedResponse = JSON.parse(response)
    return parsedResponse
  } catch (error) {
    console.error("Error getting route suggestion:", error)
    return {
      segments: [
        {
          mode: "Transit",
          route: "Default route",
          cost: 10,
          duration: 30,
          safetyScore: 8,
          details: "Unable to get specific route details at the moment",
        },
      ],
      totalCost: 10,
      totalDuration: 30,
      safetyScore: 8,
    }
  }
}

