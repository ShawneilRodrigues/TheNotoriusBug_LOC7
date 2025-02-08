import { Flame } from "lucide-react"
import ChallengeCard from "@/components/challenge-card"
import LeaderboardCard from "@/components/leaderboard-card"

const dailyChallenges = [
  {
    title: "Public Transport",
    points: 20,
    icon: "🚂",
    color: "green",
  },
  {
    title: "Walk 10k",
    points: 30,
    icon: "👟",
    color: "yellow",
  },
]

const weekChallenges = [
  {
    title: "Plant a tree",
    points: 70,
    icon: "🌱",
    color: "green",
  },
  {
    title: "Cycle 15km",
    points: 100,
    icon: "🚲",
    color: "yellow",
  },
]

export default function ChallengePage() {
  return (
    <main className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <div className="flex items-center gap-1">
          <Flame className="text-orange-500" />
          <span className="font-semibold">5</span>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Daily challenge</h2>
        <div className="grid grid-cols-2 gap-4">
          {dailyChallenges.map((challenge) => (
            <ChallengeCard key={challenge.title} {...challenge} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Week challenge</h2>
        <div className="grid grid-cols-2 gap-4">
          {weekChallenges.map((challenge) => (
            <ChallengeCard key={challenge.title} {...challenge} />
          ))}
        </div>
      </section>

      <LeaderboardCard />
    </main>
  )
}

