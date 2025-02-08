import { Card } from "@/components/ui/card"

interface EventCardProps {
  title: string
  location: string
  points: number
  image: string
}

export default function EventCard({ title, location, points, image }: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-gray-600 font-mono">{location}</p>
          </div>
          <div className="bg-black text-white px-3 py-1 rounded-full text-sm">{points}xp</div>
        </div>
      </div>
    </Card>
  )
}

