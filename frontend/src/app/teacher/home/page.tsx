"use client";

import { useEffect, useState, useMemo } from "react";
import Header from "@/components/teacher/header";
import Link from "next/link";
import {
  Users,
  Wallet,
  Calendar,
  Star,
  BookOpen,
  Clock,
  BarChart3,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";

import { teacherDashboardApi } from "@/services/APIservices/teacherApiService";
import {
  IDashboardStats,
  ICoursePerformance,
  IEarningsData,
  IScheduleItem
} from "@/types/teacher/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ================== HELPERS ================== */
const getLast6Months = () => {
  const now = new Date();
  const months: IEarningsData[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: d.toLocaleString("default", { month: "short" }).toUpperCase(),
      year: d.getFullYear(),
      amount: 0
    });
  }
  return months;
};

/* ================== PAGE ================== */
export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [topCourses, setTopCourses] = useState<ICoursePerformance[]>([]);
  const [earningsGraph, setEarningsGraph] = useState<IEarningsData[]>([]);
  const [schedule, setSchedule] = useState<IScheduleItem[]>([]);
  const [earningsTimeframe, setEarningsTimeframe] = useState("6months");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, topCoursesRes, earningsRes, scheduleRes] =
        await Promise.all([
          teacherDashboardApi.getStats(),
          teacherDashboardApi.getTopCourses(),
          teacherDashboardApi.getEarningsGraph(earningsTimeframe),
          teacherDashboardApi.getUpcomingSchedule()
        ]);

      const baseMonths = getLast6Months();
      const mergedMonths = baseMonths.map(m => {
        const found = earningsRes?.data?.find(
          (e: IEarningsData) =>
            e.month.toUpperCase() === m.month
        );
        return found ? { ...m, amount: found.amount } : m;
      });

      if (statsRes?.data) setStats(statsRes.data);
      if (topCoursesRes?.data) setTopCourses(topCoursesRes.data);
      setEarningsGraph(mergedMonths);
      if (scheduleRes?.data) setSchedule(scheduleRes.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col pt-12">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  const maxAmount = Math.max(...earningsGraph.map(e => e.amount), 1);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight mb-2">
              Teacher Dashboard
            </h1>
            <p className="text-zinc-500 font-medium">Monitoring your academic growth and performance</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="border-zinc-200 font-bold rounded-xl h-12 px-6">
              <Link href="/teacher/earnings">
                <Wallet className="w-4 h-4 mr-2" />
                Earnings
              </Link>
            </Button>
            <Button asChild className="bg-black text-white hover:bg-zinc-800 rounded-xl h-12 px-6 font-bold shadow-xl">
              <Link href="/teacher/courses">
                <PlusCircle className="w-4 h-4 mr-2" />
                Manage Courses
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            label="Active Students"
            value={stats?.activeStudents ?? 0}
            icon={<Users className="w-5 h-5" />}
            isBlack
          />
          <StatCard
            label="Total Revenue"
            value={`₹${stats?.totalEarnings?.toLocaleString() ?? 0}`}
            icon={<Wallet className="w-5 h-5 text-zinc-500" />}
          />
          <StatCard
            label="Total Courses"
            value={stats?.totalCourses ?? 0}
            icon={<BookOpen className="w-5 h-5 text-zinc-500" />}
          />
          <StatCard
            label="Monthly Payout"
            value={`₹${stats?.monthlyEarnings?.toLocaleString() ?? 0}`}
            icon={<TrendingUp className="w-5 h-5 text-zinc-500" />}
          />
        </div>

        {/* Performance Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          {/* Revenue Chart Card */}
          <Card className="lg:col-span-2 border-0 shadow-sm ring-1 ring-zinc-200 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-50 pb-6">
              <div>
                <CardTitle className="text-xl font-black text-black">Revenue Growth</CardTitle>
                <CardDescription className="font-medium">Earnings trend for the last 6 months</CardDescription>
              </div>
              <Badge variant="outline" className="bg-zinc-50 text-black border-zinc-200 font-bold">
                +12.5% vs Last Year
              </Badge>
            </CardHeader>
            <CardContent className="pt-10">
              <div className="h-72 flex items-end justify-between gap-2 sm:gap-4">
                {earningsGraph.map((item, i) => {
                  const height = item.amount === 0 ? 5 : (item.amount / maxAmount) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full"> {/* Added h-full */}
                      <div className="relative w-full flex-1 flex items-end justify-center h-full"> {/* Added h-full */}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="w-full max-w-[40px] bg-black rounded-t-xl hover:bg-zinc-700 transition-colors relative"
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] font-bold py-1 px-2 rounded-lg whitespace-nowrap shadow-xl">
                            ₹{item.amount.toLocaleString()}
                          </div>
                        </motion.div>
                      </div>
                      <span className="text-[10px] font-black text-zinc-400 tracking-tighter shrink-0"> {/* Added shrink-0 */}
                        {item.month}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Courses Card */}
          <Card className="border-0 shadow-sm ring-1 ring-zinc-200 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-zinc-50 pb-6">
              <CardTitle className="text-xl font-black text-black">Top Courses</CardTitle>
              <CardDescription className="font-medium">Based on student enrollment</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {topCourses.length > 0 ? (
                  topCourses.map((course, idx) => (
                    <div key={course.courseId} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center font-black text-zinc-400 group-hover:bg-black group-hover:text-white transition-all">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black line-clamp-1">{course.title}</p>
                          <p className="text-xs font-semibold text-zinc-400">{course.studentsCount} students</p>
                        </div>
                      </div>
                      <p className="text-xs font-black text-black">₹{course.earnings.toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <BookOpen className="w-12 h-12 text-zinc-100 mx-auto mb-2" />
                    <p className="text-zinc-400 text-sm font-bold">No data available</p>
                  </div>
                )}

                <Button asChild variant="ghost" className="w-full mt-4 font-bold text-zinc-500 hover:text-black hover:bg-zinc-50 rounded-xl">
                  <Link href="/teacher/courses">
                    View All Courses <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule & Recent Activity Grid */}
        <div className=" gap-8">
          {/* Weekly Schedule */}
          <Card className="lg:col-span-2 border-0 shadow-sm ring-1 ring-zinc-200 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-zinc-50 pb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-black">Weekly Schedule</CardTitle>
                <CardDescription className="font-medium">Managing your live sessions and slots</CardDescription>
              </div>
              <Button asChild size="sm" variant="outline" className="border-zinc-200 hover:bg-zinc-50 font-bold rounded-xl text-[10px] h-8 shadow-sm">
                <Link href="/teacher/slots">Manage Slots</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {schedule.length > 0 ? (
                  schedule.map((item) => (
                    <div key={item.id} className="p-5 rounded-2xl border border-zinc-500 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-white text-black border-zinc-200 font-bold text-[10px] uppercase">{item.day}</Badge>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                          <Clock className="w-3 h-3" />
                          {item.timeRange}
                        </div>
                      </div>
                      <h4 className="font-black text-black mb-1 line-clamp-1">{item.title}</h4>
                      <p className="text-xs font-semibold text-zinc-500 flex items-center">
                        <Briefcase className="w-3 h-3 mr-1.5" />
                        Professional Session
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center">
                    <p className="text-zinc-400 font-bold">No sessions scheduled for this period.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions / Tips Card */}
       
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, isBlack = false }: { label: string; value: string | number; icon: React.ReactNode; isBlack?: boolean }) {
  return (
    <Card className={`border-0 shadow-sm ring-1 ring-zinc-200 rounded-3xl overflow-hidden ${isBlack ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isBlack ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {label}
          </span>
          <div className={`p-2 rounded-xl ${isBlack ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
            {icon}
          </div>
        </div>
        <p className="text-3xl font-black tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}