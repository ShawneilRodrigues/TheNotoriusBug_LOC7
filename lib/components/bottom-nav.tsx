"use client"

import { Home, Medal, Calendar, History } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Medal, label: "Challenges", href: "/challenges" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: History, label: "Analytics", href: "/analytics" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
      <div className="max-w-md mx-auto flex justify-between items-center px-12 py-4">
        {navItems.map(({ icon: Icon,href }) => {
          const isActive = pathname === href
          return (
            <Link key={href} href={href} className={isActive ? "text-[#295bff]" : "text-gray-400"}>
              <Icon className="w-6 h-6" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

