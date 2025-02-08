import { ArrowLeft, BellOff } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import ChatInput from "@/components/chat-input"

export default function ChatPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 border-b">
        <button>
          <ArrowLeft className="w-6 h-6 text-[#295bff]" />
        </button>
        <h1 className="text-xl font-bold">Urbanus</h1>
        <button>
          <BellOff className="w-6 h-6 text-[#295bff]" />
        </button>
      </header>

      <div className="flex-1 p-4 space-y-4">
        <p className="text-center text-gray-500">Today, 03:20 pm</p>

        <ChatMessage message="Hello I'm Urbanus your smart city companion" isBot />
        <ChatMessage message="Hello Urbanus" />
        <ChatMessage message="Hello Yash, how can i help you ?" isBot />
        <ChatMessage message="How can I reach Dahisar sustainably ?" />
      </div>

      <ChatInput />
    </main>
  )
}

