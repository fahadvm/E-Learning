"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Medal, Users, Building2, ArrowRight } from "lucide-react";
import type { LeaderboardUser, LeaderboardResponse } from "@/types/employee/leaderboard";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { useEmployee } from "@/context/employeeContext";
import { useRouter } from "next/navigation";
import { formatMinutesToHours } from "@/utils/timeConverter";
export default function LeaderboardPage() {
  const [selectedTab, setSelectedTab] = useState<"all-time" | "weekly" | "monthly">("all-time");
  const [allTimeData, setAllTimeData] = useState<LeaderboardUser[]>([]);
  const [weeklyData, setWeeklyData] = useState<LeaderboardUser[]>([]);
  const [monthlyData, setMonthlyData] = useState<LeaderboardUser[]>([]);
  const { employee } = useEmployee()
  const router = useRouter();

  useEffect(() => {
    const fetchAllTime = async () => {
      const companyId = typeof employee?.companyId === 'object' ? employee.companyId._id : employee?.companyId;
      if (!companyId) {
        console.log("there is no company id ")
        return
      }
      const res = await employeeApiMethods.getAllTimeLeaderBoard({ companyId })
      console.log("iam trying for fetch all time leaderboard", res)
      if (res?.ok && res.data) {
        setAllTimeData(res.data.leaderboard);
      }
    };

    const fetchWeekly = async () => {
      const companyId = typeof employee?.companyId === 'object' ? employee.companyId._id : employee?.companyId;
      if (!companyId) return
      const res = await employeeApiMethods.getWeeklyLeaderBoard({ companyId })
      console.log("weekly :", res)
      if (res?.ok && res.data) {
        setWeeklyData(res.data.leaderboard);
      }
    };

    const fetchMonthly = async () => {
      const companyId = typeof employee?.companyId === 'object' ? employee.companyId._id : employee?.companyId;
      if (!companyId) return
      const res = await employeeApiMethods.getMonthlyLeaderBoard({ companyId })
      console.log("monthly :", res)
      if (res?.ok && res.data) {
        setMonthlyData(res.data.leaderboard);
      }
    };

    fetchAllTime();
    fetchWeekly();
    fetchMonthly();
  }, [employee]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  if (!employee?.companyId) {
    return (
      <div className=" mt-10 flex flex-col items-center justify-center text-center px-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
          <Users className="w-12 h-12 text-blue-600" />
        </div>

        <h3 className="text-3xl font-bold text-gray-900 mb-3">
          You’re not part of a company yet
        </h3>

        <p className="text-lg text-gray-600 mb-8 max-w-xl">
          Join a company to unlock leaderboards, team learning paths, and collaborative growth.
        </p>

        <button
          onClick={() => router.push('/employee/company')}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <Building2 className="w-5 h-5" />
          Join a Company
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }


  const currentLeaderboard = selectedTab === "all-time" ? allTimeData : selectedTab === "weekly" ? weeklyData : monthlyData;
  const userRank = currentLeaderboard.find(u => u.isYou);

  const LeaderboardTable = ({ data }: { data: LeaderboardUser[] }) => (
    <Card className="overflow-hidden border-primary/10">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Rank</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Name</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">Hours</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">Streak</th>
            <th className="px-3 py-3 text-right text-sm font-semibold text-muted-foreground">Completed Courses</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                No learning activity recorded for this period yet.
              </td>
            </tr>
          ) : (
            data.map((user) => (
              <tr
                key={user._id}
                className={`border-b transition-colors duration-200 ${user.isYou ? "bg-primary/5" : "hover:bg-muted/30"
                  }`}
              >
                <td className="px-6 py-4">{getRankIcon(user.rank)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                      ) : (
                        (user.name).slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{user.name}</span>
                      {user.isYou && <span className="text-[10px] items-center self-start px-1.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider font-bold">You</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-medium text-gray-700">{formatMinutesToHours(user.hours)}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Flame className="h-4 w-4 text-orange-500 fill-orange-500/10" />
                    <span className="font-medium">{user.streak}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Badge variant="outline" className="font-mono bg-background/50">
                    {user.courses}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Leaderboard</h1>
        <p className="text-lg text-muted-foreground">Celebrate excellence and see how you shine among your peers</p>
      </div>

      {/* Your Rank Card */}
      {userRank && (
        <Card className="p-1 px-1 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Trophy className="w-32 h-32 text-primary" />
          </div>
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary/60">Your {selectedTab.replace('-', ' ')} Stats</p>
                  <p className="text-5xl font-black mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    #{userRank.rank}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                    {formatMinutesToHours(userRank.hours)} learning hours
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                    {userRank.courses} courses completed
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-inner flex items-center justify-center text-3xl">
                  🎯
                </div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Growth Mindset</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as "all-time" | "weekly" | "monthly")} className="w-full space-y-6">
        <TabsList className="p-1 bg-muted/50 rounded-xl inline-flex w-auto border border-primary/5">
          <TabsTrigger value="all-time" className="rounded-lg px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all grayscale data-[state=active]:grayscale-0">All Time</TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-lg px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all grayscale data-[state=active]:grayscale-0">Monthly</TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-lg px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all grayscale data-[state=active]:grayscale-0">Weekly</TabsTrigger>
        </TabsList>

        <TabsContent value="all-time" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <LeaderboardTable data={allTimeData} />
        </TabsContent>

        <TabsContent value="monthly" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <LeaderboardTable data={monthlyData} />
        </TabsContent>

        <TabsContent value="weekly" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <LeaderboardTable data={weeklyData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
