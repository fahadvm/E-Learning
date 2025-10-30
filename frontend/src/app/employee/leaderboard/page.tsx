"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame, Medal, Star } from "lucide-react"

const leaderboardData = [
  { rank: 1, name: "Alex Chen", hours: 156, streak: 45, courses: 12, avatar: "AC" },
  { rank: 2, name: "Emma Wilson", hours: 142, streak: 38, courses: 11, avatar: "EW" },
  { rank: 3, name: "James Rodriguez", hours: 138, streak: 32, courses: 10, avatar: "JR" },
  { rank: 4, name: "Sarah Johnson", hours: 124, streak: 12, courses: 8, avatar: "SJ" },
  { rank: 5, name: "Michael Brown", hours: 118, streak: 28, courses: 9, avatar: "MB" },
  { rank: 6, name: "Lisa Anderson", hours: 112, streak: 15, courses: 7, avatar: "LA" },
  { rank: 7, name: "David Martinez", hours: 108, streak: 22, courses: 8, avatar: "DM" },
  { rank: 8, name: "Jessica Lee", hours: 102, streak: 18, courses: 7, avatar: "JL" },
]

const weeklyLeaders = [
  { rank: 1, name: "Emma Wilson", hours: 18.5, streak: 7, avatar: "EW" },
  { rank: 2, name: "Alex Chen", hours: 16.2, streak: 7, avatar: "AC" },
  { rank: 3, name: "James Rodriguez", hours: 14.8, streak: 6, avatar: "JR" },
  { rank: 4, name: "Sarah Johnson", hours: 12.5, streak: 5, avatar: "SJ" },
  { rank: 5, name: "Michael Brown", hours: 11.3, streak: 4, avatar: "MB" },
]

const monthlyLeaders = [
  { rank: 1, name: "Alex Chen", hours: 156, courses: 12, avatar: "AC" },
  { rank: 2, name: "Emma Wilson", hours: 142, courses: 11, avatar: "EW" },
  { rank: 3, name: "James Rodriguez", hours: 138, courses: 10, avatar: "JR" },
]

export default function LeaderboardPage() {
  const [selectedTab, setSelectedTab] = useState("all-time")

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">See how you rank among your peers</p>
      </div>

      {/* Your Rank Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Your Current Rank</p>
            <p className="text-4xl font-bold mt-2">#4</p>
            <p className="text-sm text-muted-foreground mt-2">124 learning hours • 8 courses completed</p>
          </div>
          <div className="text-right">
            <div className="text-5xl">🎯</div>
            <p className="text-sm font-medium mt-2">Keep it up!</p>
          </div>
        </div>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>

        {/* All Time Leaderboard */}
        <TabsContent value="all-time" className="mt-6">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Learning Hours</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Streak</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Courses</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-border transition-colors ${
                        user.rank === 4 ? "bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">{getRankIcon(user.rank)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
                            {user.avatar}
                          </div>
                          <span className="font-medium">{user.name}</span>
                          {user.rank === 4 && <Badge variant="secondary">You</Badge>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold">{user.hours}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="font-semibold">{user.streak}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold">{user.courses}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Monthly Leaderboard */}
        <TabsContent value="monthly" className="mt-6">
          <div className="space-y-4">
            {monthlyLeaders.map((user, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/20">
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.courses} courses completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{user.hours}</p>
                    <p className="text-xs text-muted-foreground">learning hours</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Weekly Leaderboard */}
        <TabsContent value="weekly" className="mt-6">
          <div className="space-y-4">
            {weeklyLeaders.map((user, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/20">
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <p className="text-sm text-muted-foreground">{user.streak}-day streak</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{user.hours}</p>
                    <p className="text-xs text-muted-foreground">hours this week</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recognition Section */}
      <Card className="p-6">
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Top Achievements This Month
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Most Consistent", user: "Alex Chen", icon: "🔥" },
            { title: "Fastest Learner", user: "Emma Wilson", icon: "⚡" },
            { title: "Most Courses", user: "James Rodriguez", icon: "📚" },
          ].map((achievement, idx) => (
            <div key={idx} className="p-4 border border-border rounded-lg text-center space-y-2">
              <div className="text-4xl">{achievement.icon}</div>
              <h4 className="font-semibold">{achievement.title}</h4>
              <p className="text-sm text-muted-foreground">{achievement.user}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
