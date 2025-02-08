import { Cloud, Compass, Sun, CloudRain } from "lucide-react"
import { Card } from "@/components/ui/card"

const hourlyForecast = [
  { time: "18:00", temp: 25, aqi: 47, icon: CloudRain, weather: "rain" },
  { time: "19:00", temp: 26, aqi: 51, icon: Cloud, weather: "cloudy" },
  { time: "20:00", temp: 27, aqi: 62, icon: Cloud, weather: "partly-cloudy" },
  { time: "21:00", temp: 27, aqi: 54, icon: Sun, weather: "clear" },
  { time: "22:00", temp: 23, aqi: 44, icon: Cloud, weather: "partly-cloudy" },
  { time: "23:00", temp: 22, aqi: 42, icon: Sun, weather: "clear" },
]

export default function WeatherCard() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Compass className="w-5 h-5 text-[#295bff]" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Dahisar</h3>
          <p className="text-gray-600">Mumbai</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Cloud className="w-8 h-8 text-[#295bff]" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-semibold">27°C</span>
              <span className="text-green-500 text-sm">↑</span>
            </div>
            <p className="text-gray-600">Rain Shower</p>
            <p className="text-gray-500 text-sm">Feels like 24°C</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold">50</span>
          <div className="p-1 bg-green-100 rounded-full">
            <span className="text-green-500 text-xl">☺</span>
          </div>
          <span className="text-gray-600">AQI</span>
        </div>
      </div>

      <div>
        <h4 className="text-gray-700 mb-4">Forcast</h4>
        <div className="grid grid-cols-6 gap-4">
          {hourlyForecast.map((hour) => (
            <div key={hour.time} className="text-center">
              <p className="text-gray-600 text-sm mb-2">{hour.time}</p>
              <div className="flex justify-center mb-2">
                <div className="p-1 bg-green-100 rounded-full">
                  <span className="text-green-500 text-lg">☺</span>
                </div>
              </div>
              <p className="text-sm mb-2">
                <span className="font-medium">{hour.aqi}</span>
                <span className="text-gray-500 text-xs">AQI</span>
              </p>
              <hour.icon className="w-6 h-6 mx-auto mb-2 text-[#295bff]" />
              <p className="font-medium">{hour.temp}°C</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-1 mt-6">
        <div className="w-6 h-1.5 bg-[#295bff] rounded-full" />
        <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
        <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
        <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
      </div>
    </Card>
  )
}

