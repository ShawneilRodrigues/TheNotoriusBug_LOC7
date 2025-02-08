import EventCard from "@/components/event-card"

const categories = ["Exercise", "Meet", "Animal", "Clean"]
const events = [
  {
    title: "Orphanage Visit",
    location: "Palghar Anath Ashram",
    points: 400,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Main_file-xACBUUAG5Nb1WwB22jfBzB1HVjcuxP.png",
  },
  {
    title: "Beach Cleanup",
    location: "Jhuh beach cleaning by DJNSS",
    points: 250,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Main_file-xACBUUAG5Nb1WwB22jfBzB1HVjcuxP.png",
  },
]

export default function EventsPage() {
  return (
    <main className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Events</h1>

      <div className="flex gap-2 overflow-x-auto py-2">
        {categories.map((category) => (
          <button key={category} className="px-4 py-2 bg-[#b5e2ff] rounded-lg text-[#295bff] whitespace-nowrap">
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event.title} {...event} />
        ))}
      </div>
    </main>
  )
}

