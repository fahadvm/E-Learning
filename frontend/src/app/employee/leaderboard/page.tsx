"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Medal } from "lucide-react";
import type { LeaderboardUser, LeaderboardResponse } from "@/types/employee/leaderboard";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { useEmployee } from "@/context/employeeContext";
export default function LeaderboardPage() {
  const [selectedTab, setSelectedTab] = useState<"all-time" | "weekly" | "monthly">("all-time");

  const [allTimeData, setAllTimeData] = useState<LeaderboardUser[]>([]);
  const [weeklyData, setWeeklyData] = useState<LeaderboardUser[]>([]);
  const [monthlyData, setMonthlyData] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardUser | null>(null);
  const { employee } = useEmployee()

  useEffect(() => {
    fetchAllTime();
    fetchWeekly();
    fetchMonthly();
  }, [employee]);


  const fetchAllTime = async () => {
    if (!employee?.companyId) {
      console.log("there is no company id ")
      return
    }
    const res = await employeeApiMethods.getAllTimeLeaderBoard({ companyId: employee.companyId })
    console.log("iam trying for fetch all time leaderboard")
    const data: LeaderboardResponse = res.data;
    setAllTimeData(data.leaderboard);
    setUserRank(data.you ?? null);
  };

  const fetchWeekly = async () => {
    if (!employee?.companyId) return
    const res = await employeeApiMethods.getWeeklyLeaderBoard({ companyId: employee.companyId })
    const data: LeaderboardResponse = res.data;
    setWeeklyData(data.leaderboard);
  };

  const fetchMonthly = async () => {
    if (!employee?.companyId) return
    const res = await employeeApiMethods.getMonthlyLeaderBoard({ companyId: employee.companyId })

    const data: LeaderboardResponse = res.data;
    setMonthlyData(data.leaderboard);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Leaderboard of {employee?.name}</h1>
        <p className="text-muted-foreground mt-2">See how you rank among your peers</p>
      </div>

      {/* Your Rank */}
      {userRank && (
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Current Rank</p>
              <p className="text-4xl font-bold mt-2">#{userRank.rank}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {userRank.hours} learning hours • {userRank.courses} courses completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl">🎯</div>
              <p className="text-sm font-medium mt-2">Keep it up!</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>

        {/* All Time */}
        <TabsContent value="all-time" className="mt-6">
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-4 text-left">Rank</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-right">Hours</th>
                  <th className="px-6 py-4 text-right">Streak</th>
                  <th className="px-6 py-4 text-right">Courses</th>
                </tr>
              </thead>
              <tbody>
                {allTimeData.map((user) => (
                  <tr
                    key={user._id}
                    className={`border-b transition ${user.isYou ? "bg-primary/5" : "hover:bg-muted/50"
                      }`}
                  >
                    <td className="px-6 py-4">{getRankIcon(user.rank)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
                          {(user.avatar ?? user.name).slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.name}</span>
                        {user.isYou && <Badge variant="secondary">You</Badge>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">{user.hours}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Flame className="h-4 w-4 text-orange-500" /> {user.streak}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">{user.courses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        {/* Monthly */}
        <TabsContent value="monthly" className="mt-6">
          {monthlyData.map((user) => (
            <Card key={user._id} className="p-6 flex items-center justify-between">
              {getRankIcon(user.rank)}
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.courses} courses</p>
              <p className="text-2xl font-bold text-primary">{user.hours}</p>
            </Card>
          ))}
        </TabsContent>

        {/* Weekly */}
        <TabsContent value="weekly" className="mt-6">
          {weeklyData.map((user) => (
            <Card key={user._id} className="p-6 flex items-center justify-between">
              {getRankIcon(user.rank)}
              <h3 className="font-semibold">{user.name}</h3>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <p className="text-sm text-muted-foreground">{user.streak}-day streak</p>
              </div>
              <p className="text-2xl font-bold text-primary">{user.hours}</p>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
