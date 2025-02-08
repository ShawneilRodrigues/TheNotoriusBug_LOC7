import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  message: string
  isBot?: boolean
}

export default function ChatMessage({ message, isBot }: ChatMessageProps) {
  return (
    <div className={`flex gap-2 ${isBot ? "" : "flex-row-reverse"}`}>
      <Avatar className="w-8 h-8">
        {isBot ? (
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
          isBot ? "bg-gray-200 text-gray-800" : "bg-[#295bff] text-white ml-auto"
        }`}
      >
        <p>{message}</p>
      </div>
    </div>
  )
}

