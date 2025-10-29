"use client"

import { Calendar, Clock, Users } from "lucide-react"

const upcomingClasses = [
  {
    id: 1,
    title: "React Hooks Deep Dive",
    date: "Today",
    time: "2:00 PM - 3:30 PM",
    students: 24,
  },
  {
    id: 2,
    title: "State Management Patterns",
    date: "Tomorrow",
    time: "10:00 AM - 11:30 AM",
    students: 18,
  },
  {
    id: 3,
    title: "Performance Optimization",
    date: "Dec 15",
    time: "3:00 PM - 4:30 PM",
    students: 31,
  },
]

export default function UpcomingClasses() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
      <h3 className="text-xl font-bold text-foreground mb-4">Upcoming Classes</h3>

      <div className="space-y-3">
        {upcomingClasses.map((cls) => (
          <div
            key={cls.id}
            className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          >
            <p className="font-semibold text-foreground text-sm">{cls.title}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{cls.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{cls.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Users size={14} />
              <span>{cls.students} students</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
