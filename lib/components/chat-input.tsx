import { Image, Mic, Send } from "lucide-react"

export default function ChatInput() {
  return (
    <div className="p-4 border-t bg-white">
      <div className="flex items-center gap-2 bg-[#edf8ff] rounded-full p-2">
        <button className="p-2 hover:bg-white rounded-full">
          <Mic className="w-6 h-6 text-[#295bff]" />
        </button>
        <button className="p-2 hover:bg-white rounded-full">
          <Image className="w-6 h-6 text-[#295bff]" />
        </button>
        <input
          type="text"
          placeholder="Type your message here"
          className="flex-1 bg-transparent border-none focus:outline-none text-gray-700"
        />
        <button className="p-2 hover:bg-white rounded-full">
          <Send className="w-6 h-6 text-[#295bff]" />
        </button>
      </div>
    </div>
  )
}

