"use client"

import { ArrowLeft, BellOff, Image, Mic, Send } from "lucide-react"
import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: number
  text: string
  isBot: boolean
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello I'm Urbanus your smart city companion",
    isBot: true,
  },
  {
    id: 2,
    text: "Hello Urbanus",
    isBot: false,
  },
  {
    id: 3,
    text: "Hello Yash, how can i help you ?",
    isBot: true,
  },
  {
    id: 4,
    text: "How can I reach Dahisar sustainably ?",
    isBot: false,
  },
]

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div ref={modalRef} className="fixed inset-0 bg-[#edf8ff] z-50 flex flex-col">
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <button onClick={onClose}>
          <ArrowLeft className="w-6 h-6 text-[#295bff]" />
        </button>
        <h1 className="text-xl font-bold">Urbanus</h1>
        <button>
          <BellOff className="w-6 h-6 text-[#295bff]" />
        </button>
      </header>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <p className="text-center text-gray-500">Today, 03:20 pm</p>

        {initialMessages.map((message) => (
          <div key={message.id} className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}>
            <Avatar className="w-8 h-8">
              {message.isBot ? (
                <div className="bg-[#613eea] p-2 rounded-full">
                  <span className="text-white text-xs">AI</span>
                </div>
              ) : (
                <AvatarImage src="/placeholder.svg" />
              )}
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div
              className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                message.isBot ? "bg-gray-200 text-gray-800" : "bg-[#295bff] text-white ml-auto"
              }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

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
    </div>
  )
}

