import { Compass, Truck, Sun } from "lucide-react"

const insights = [
  {
    type: "accident",
    title: "Accident",
    description: "Near Toll Naka [30+ mins]",
    color: "bg-red-100",
    textColor: "text-red-500",
    icon: Truck,
  },
  {
    type: "pollen",
    title: "Pollen Surge",
    description: "Jogeshwari East",
    color: "bg-yellow-100",
    textColor: "text-yellow-500",
    icon: Compass,
  },
  {
    type: "uv",
    title: "UV Index Spike",
    description: "Thane-Kalyan [9]",
    color: "bg-purple-100",
    textColor: "text-purple-500",
    icon: Sun,
  },
]

export default function AIInsights() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-white rounded-xl p-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Compass className="w-5 h-5 text-[#295bff]" />
        </div>
        <span className="text-lg font-semibold text-[#295bff]">AI Insights</span>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.type} className={`${insight.color} rounded-xl p-4`}>
            <div className="flex items-center gap-2">
              <insight.icon className={`w-5 h-5 ${insight.textColor}`} />
              <span className="font-semibold">{insight.title}</span>
            </div>
            <p className={`${insight.textColor} font-mono mt-1`}>{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

