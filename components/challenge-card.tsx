interface ChallengeCardProps {
  title: string
  points: number
  icon: string
  color: "green" | "yellow"
}

export default function ChallengeCard({ title, points, icon, color }: ChallengeCardProps) {
  const bgColor = color === "green" ? "from-green-400 to-green-600" : "from-yellow-400 to-yellow-600"

  return (
    <div className={`relative bg-gradient-to-br ${bgColor} rounded-xl p-4 text-white overflow-hidden`}>
      <div className="absolute top-2 right-2 bg-white rounded-lg w-8 h-8 flex items-center justify-center">
        <span className="text-xl">{icon}</span>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold mt-2">{points}</p>
      </div>
    </div>
  )
}

