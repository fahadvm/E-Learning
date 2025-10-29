"use client"

import { LayoutDashboard, BookOpen, Calendar, Users, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#" },
  { icon: BookOpen, label: "Courses", href: "#" },
  { icon: Calendar, label: "Schedule", href: "#" },
  { icon: Users, label: "Students", href: "#" },
  { icon: User, label: "Profile", href: "#" },
]

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard")

  return (
    <aside className="w-64 bg-white border-r border-border shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">DevNext</h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.label
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setActiveItem(item.label)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-all">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
