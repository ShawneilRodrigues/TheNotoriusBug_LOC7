import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const leaderboard = [
  { rank: 1, name: "Marsha Fisher", points: 36, image: "/placeholder.svg" },
  { rank: 2, name: "Juanita Cormier", points: 35, image: "/placeholder.svg" },
  { rank: 3, name: "You", points: 34, image: "/placeholder.svg", isUser: true },
  { rank: 4, name: "Tamara Schmidt", points: 33, image: "/placeholder.svg" },
  { rank: 5, name: "Eleanor Lee", points: 32, image: "/placeholder.svg" },
]

export default function LeaderboardCard() {
  return (
    <div className="mt-8">
      <div className="bg-gray-800 text-white rounded-xl p-4 flex justify-between mb-4">
        <button className="font-medium">Region</button>
        <button className="font-medium opacity-50">District</button>
        <button className="font-medium opacity-50">Friends</button>
      </div>

      <div className="space-y-2">
        {leaderboard.map((item) => (
          <div
            key={item.rank}
            className={`flex items-center justify-between p-4 rounded-xl ${
              item.isUser ? "bg-gray-800 text-white" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6">{item.rank}</span>
              <Avatar>
                <AvatarImage src={item.image} />
                <AvatarFallback>{item.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{item.name}</span>
            </div>
            <span>{item.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}

