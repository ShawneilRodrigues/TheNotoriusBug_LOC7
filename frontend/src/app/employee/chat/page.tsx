"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThumbsUp, ThumbsDown } from "lucide-react"

export default function EmployeeChat() {
  const [chatInput, setChatInput] = useState("")
  const [chatHistory, setChatHistory] = useState([{ role: "ai", content: "Hello! How can I assist you today?" }])

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatInput.trim() === "") return

    // Add user message to chat history
    setChatHistory((prev) => [...prev, { role: "user", content: chatInput }])

    // Here you would typically call your API to get AI response
    // For demo, we'll just echo the user's input
    setTimeout(() => {
      setChatHistory((prev) => [...prev, { role: "ai", content: `You said: ${chatInput}` }])
    }, 1000)

    setChatInput("")
  }

  const suggestedQuestions = [
    "What's the company's vacation policy?",
    "How do I request time off?",
    "What are the office hours?",
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">AI Support Chat</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {chatHistory.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-sm rounded-lg p-3 ${message.role === "user" ? "bg-blue-500 text-white" : "bg-white"}`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </main>
        <footer className="bg-white p-4">
          <form onSubmit={handleChatSubmit} className="max-w-3xl mx-auto flex space-x-2">
            <Input
              placeholder="Type your question here..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </footer>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Suggested Questions</h2>
        <ul className="space-y-2">
          {suggestedQuestions.map((question, index) => (
            <li key={index}>
              <Button variant="ghost" className="w-full justify-start text-left" onClick={() => setChatInput(question)}>
                {question}
              </Button>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Rate Last Response</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon">
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </div>
  )
}

