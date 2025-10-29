"use client"

import { BookOpen, Users, Star, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: BookOpen,
    label: "Total Courses",
    value: "12",
    change: "+2 this month",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Users,
    label: "Active Students",
    value: "342",
    change: "+45 new students",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Star,
    label: "Average Rating",
    value: "4.8",
    change: "Out of 5.0",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: TrendingUp,
    label: "Total Earnings",
    value: "$8,420",
    change: "+12% from last month",
    color: "from-emerald-500 to-emerald-600",
  },
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4`}
            >
              <Icon size={24} className="text-white" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
          </div>
        )
      })}
    </div>
  )
}
