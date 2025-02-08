import WeatherCard from "@/components/weather-card"
import AIInsights from "@/components/ai-insights"

export default function HomePage() {
  return (
    <main className="p-4 space-y-6">
      <div className="space-y-1">
        <h2 className="text-gray-700 text-xl">Welcome Back 👋</h2>
        <h1 className="text-4xl font-bold text-gray-900">Yash</h1>
      </div>
      <WeatherCard />
      <AIInsights />
    </main>
  )
}

