"use client"

import { Inter } from "next/font/google"
import { useState } from "react"
import { MessageCircle } from "lucide-react"
import "./globals.css"
import BottomNav from "@/components/bottom-nav"
import ChatModal from "@/components/chat-modal"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#edf8ff]`}>
        <div className="mx-auto max-w-md min-h-screen relative pb-20">
          {children}
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20">
            <button onClick={() => setIsChatOpen(true)} className="bg-[#613eea] p-4 rounded-full shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </button>
          </div>
          <BottomNav />
          <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
      </body>
    </html>
  )
}

