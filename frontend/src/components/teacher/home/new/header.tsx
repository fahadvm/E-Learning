"use client"

import { Bell, Search, Settings } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="px-8 py-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Welcome back, Sarah!</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening with your courses today</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Bell size={20} className="text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Settings size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}
