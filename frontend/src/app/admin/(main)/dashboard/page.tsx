"use client";

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from "framer-motion";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Video,
  UserPlus,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { adminApiMethods } from '@/services/APIservices/adminApiService';
import { formatDistanceToNow } from 'date-fns';
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* -------------------- Animations -------------------- */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

/* -------------------- Component -------------------- */
export default function WelcomePage() {
  const [displayText, setDisplayText] = useState('');
  const [metrics, setMetrics] = useState<any[]>([]);
  const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fullText = 'Your ultimate e-learning platform';

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100);

    const fetchDashboardData = async () => {
      try {
        const res = await adminApiMethods.getDashboardStats();
        // The API response structure is { success, message, data: { stats, monthlyRevenue, recentActivity } }
        // res.data is the Axios response body.
        const dashboardData = res.data.data || res.data;
        const { stats, monthlyRevenue, recentActivity } = dashboardData;

        if (!stats) {
          console.error("Stats missing from dashboard data", dashboardData);
          return;
        }

        // Map metrics
        const m = [
          {
            title: "Total Revenue",
            value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
            change: "Overall",
            trend: "up",
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            title: "Students",
            value: (stats.totalStudents || 0).toLocaleString(),
            change: "Enrolled",
            trend: "up",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            title: "Teachers",
            value: (stats.totalTeachers || 0).toLocaleString(),
            change: "Active",
            trend: "up",
            icon: BookOpen,
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
          {
            title: "Courses",
            value: (stats.totalCourses || 0).toLocaleString(),
            change: "Published",
            trend: "up",
            icon: BookOpen,
            color: "text-orange-600",
            bg: "bg-orange-100",
          },
        ];
        setMetrics(m);

        // Map chart data
        if (monthlyRevenue) {
          const chartData = monthlyRevenue.map((item: any) => ({
            name: monthNames[item._id - 1],
            revenue: item.revenue
          }));
          setRevenueChartData(chartData);
        }

        // Map activities
        if (recentActivity) {
          const mappedActivities = recentActivity.map((act: any, idx: number) => {
            let icon = CheckCircle;
            let color = "text-green-600 bg-green-100";

            if (act.type === 'purchase') {
              icon = UserPlus;
              color = "text-blue-600 bg-blue-100";
            } else if (act.type === 'upload') {
              icon = Video;
              color = "text-purple-600 bg-purple-100";
            } else if (act.type === 'signup') {
              icon = Users;
              color = "text-orange-600 bg-orange-100";
            }

            return {
              id: idx,
              user: act.user,
              action: act.action,
              target: act.target,
              time: act.time ? formatDistanceToNow(new Date(act.time), { addSuffix: true }) : 'Recently',
              color,
              icon
            };
          });
          setActivities(mappedActivities);
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="">

      {/* PAGE CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* HERO */}
        <div className="relative w-full h-[80vh] md:h-[90vh]">
          <Image
            src="/black-banner.jpg"
            alt="DevNext Welcome"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Welcome to DevNext
            </h1>
            <p className="text-white text-lg sm:text-xl md:text-2xl max-w-2xl">
              {displayText}
            </p>
          </div>
        </div>

        {/* DASHBOARD */}
        <div className="space-y-6 mt-10 px-4 md:px-8">

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <span className="text-sm text-slate-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Real-time Insights
            </span>
          </div>

          {/* METRICS GRID */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse bg-slate-50 h-32 border-none" />
              ))
            ) : (
              metrics.map((metric: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow border-none shadow-sm bg-white overflow-hidden group">
                    <CardContent className="p-6 relative">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-1">{metric.title}</p>
                          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {metric.value}
                          </h3>
                        </div>
                        <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300", metric.bg)}>
                          <metric.icon className={cn("h-6 w-6", metric.color)} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                        <span>{metric.change}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* GRID WITH CHART + ACTIVITY */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

            {/* CHART */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-4"
            >
              <Card className="border-none shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center justify-between">
                    Revenue Overview
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1 text-xs font-normal text-slate-500">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        Monthly Sales
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full pt-4">
                    {loading ? (
                      <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueChartData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>

                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />

                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value: any) => [`₹${value.toLocaleString()}`, "Revenue"]}
                          />

                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3b82f6"
                            fill="url(#colorRevenue)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* RECENT ACTIVITY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="col-span-3"
            >
              <Card className="border-none shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {loading ? (
                      [1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex gap-4 animate-pulse">
                          <div className="w-10 h-10 rounded-full bg-slate-50" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-50 w-1/3 rounded" />
                            <div className="h-3 bg-slate-50 w-2/3 rounded" />
                          </div>
                        </div>
                      ))
                    ) : activities.length === 0 ? (
                      <div className="text-center py-10 text-slate-400">No recent activity</div>
                    ) : (
                      activities.map((activity: any, idx: number) => (
                        <div key={idx} className="flex items-start group">
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                              activity.color.replace("bg-", "border-").replace("text-", "bg-opacity-10 ")
                            )}
                          >
                            <activity.icon className={cn("h-5 w-5", activity.color.split(" ")[0])} />
                          </div>

                          <div className="ml-4 flex-1">
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {activity.user}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {activity.action}{" "}
                              <span className="font-medium text-slate-700">{activity.target}</span>
                            </p>
                            <div className="mt-1 text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                              {activity.time}
                            </div>
                          </div>

                          <div className="h-2 w-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
