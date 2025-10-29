"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const engagementData = [
  { day: "Mon", engagement: 65 },
  { day: "Tue", engagement: 78 },
  { day: "Wed", engagement: 72 },
  { day: "Thu", engagement: 85 },
  { day: "Fri", engagement: 92 },
  { day: "Sat", engagement: 68 },
  { day: "Sun", engagement: 55 },
]

export default function StudentEngagement() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
      <h3 className="text-xl font-bold text-foreground mb-4">Student Engagement</h3>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={engagementData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-background)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="engagement" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
