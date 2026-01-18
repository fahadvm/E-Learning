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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
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
  Clock,
  Layout,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { adminApiMethods } from '@/services/APIservices/adminApiService';
import { formatDistanceToNow } from 'date-fns';
import { DashboardMetric, RevenueChartData, MappedActivity, MonthlyRevenueItem, RecentActivityItem, UserDistributionData, TopCourse } from '@/types/admin/adminTypes';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

export default function WelcomePage() {
  const [displayText, setDisplayText] = useState('');
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [revenueChartData, setRevenueChartData] = useState<RevenueChartData[]>([]);
  const [activities, setActivities] = useState<MappedActivity[]>([]);
  const [userDistribution, setUserDistribution] = useState<UserDistributionData[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<{ name: string; value: number }[]>([]);
  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
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
        const dashboardData = res.data.data || res.data;
        const { stats, monthlyRevenue, recentActivity, userDistribution, categoryDistribution, topCourses } = dashboardData;

        if (!stats) return;

        // Map metrics
        const m = [
          {
            title: "Total Revenue",
            value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
            change: "Overall", trend: "up", icon: DollarSign, color: "text-green-600", bg: "bg-green-100",
          },
          {
            title: "Students",
            value: (stats.totalStudents || 0).toLocaleString(),
            change: "Enrolled", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-100",
          },
          {
            title: "Teachers",
            value: (stats.totalTeachers || 0).toLocaleString(),
            change: "Active", trend: "up", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-100",
          },
          {
            title: "Courses",
            value: (stats.totalCourses || 0).toLocaleString(),
            change: "Published", trend: "up", icon: BookOpen, color: "text-orange-600", bg: "bg-orange-100",
          },
        ];
        setMetrics(m);

        if (monthlyRevenue) {
          setRevenueChartData(monthlyRevenue.map((item: MonthlyRevenueItem) => ({
            name: monthNames[item._id - 1],
            revenue: item.revenue
          })));
        }

        if (userDistribution) setUserDistribution(userDistribution);
        if (categoryDistribution) setCategoryDistribution(categoryDistribution);
        if (topCourses) setTopCourses(topCourses);

        if (recentActivity) {
          setActivities(recentActivity.map((act: RecentActivityItem, idx: number) => {
            let icon = CheckCircle;
            let color = "text-green-600 bg-green-100";
            if (act.type === 'purchase') { icon = UserPlus; color = "text-blue-600 bg-blue-100"; }
            else if (act.type === 'upload') { icon = Video; color = "text-purple-600 bg-purple-100"; }
            else if (act.type === 'signup') { icon = Users; color = "text-orange-600 bg-orange-100"; }
            return {
              id: idx, user: act.user, action: act.action, target: act.target,
              time: act.time ? formatDistanceToNow(new Date(act.time), { addSuffix: true }) : 'Recently',
              color, icon
            };
          }));
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
    <div className="pb-10">
      <div className="flex-1 flex flex-col">
        {/* HERO */}
        <div className="relative w-full h-[60vh]">
          <Image src="/black-banner.jpg" alt="DevNext Welcome" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
            >
              Welcome to DevNext
            </motion.h1>
            <p className="text-white text-lg sm:text-xl md:text-2xl max-w-2xl">{displayText}</p>
          </div>
        </div>

        {/* DASHBOARD CONTENT */}
        <div className="space-y-10 mt-10 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
              <p className="text-slate-500 mt-1">Platform performance and user activity at a glance.</p>
            </div>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Live Updates
            </span>
          </div>

          {/* METRICS GRID */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              [1, 2, 3, 4].map((i) => <Card key={i} className="animate-pulse bg-slate-50 h-32 border-none" />)
            ) : (
              metrics.map((metric, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="hover:shadow-md transition-shadow border-none shadow-sm bg-white overflow-hidden group">
                    <CardContent className="p-6 relative">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-1">{metric.title}</p>
                          <h3 className="text-3xl font-bold text-slate-900">{metric.value}</h3>
                        </div>
                        <div className={cn("p-3 rounded-2xl transition-transform group-hover:rotate-12 duration-300", metric.bg)}>
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

          {/* MAIN CHARTS SECTION */}
          <div className="grid gap-6 lg:grid-cols-7">
            {/* REVENUE CHART */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-4">
              <Card className="border-none shadow-sm h-full overflow-hidden">
                <CardHeader className="bg-slate-50/50">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[350px] w-full">
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
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#colorRevenue)" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* USER DISTRIBUTION */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-3">
              <Card className="border-none shadow-sm h-full">
                <CardHeader className="bg-slate-50/50">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-purple-500" />
                    User Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[350px] w-full">
                    {loading ? (
                      <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={userDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {userDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* SECONDARY CHARTS SECTION */}
          <div className="grid gap-6 lg:grid-cols-7">
            {/* TOP COURSES BAR CHART */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-4">
              <Card className="border-none shadow-sm h-full">
                <CardHeader className="bg-slate-50/50">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    Top Performing Courses
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[350px] w-full">
                    {loading ? (
                      <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topCourses} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis dataKey="title" type="category" width={100} fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{ fill: 'transparent' }} />
                          <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* CATEGORY DISTRIBUTION */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-3">
              <Card className="border-none shadow-sm h-full">
                <CardHeader className="bg-slate-50/50">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Layout className="w-5 h-5 text-green-500" />
                    Popular Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[350px] w-full">
                    {loading ? (
                      <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent?percent * 100:0 * 100).toFixed(0)}%`}
                          >
                            {categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* RECENT ACTIVITY SECTION */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">Recent Platform Activity</CardTitle>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-xl" />)
                  ) : activities.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-slate-400">No recent activity detected.</div>
                  ) : (
                    activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center p-4 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100 group">
                        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110", activity.color)}>
                          <activity.icon className="h-6 w-6" />
                        </div>
                        <div className="ml-4 overflow-hidden">
                          <p className="text-sm font-semibold text-slate-900 truncate">{activity.user}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {activity.action} <span className="font-medium text-slate-700">{activity.target}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium">{activity.time}</p>
                        </div>
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
  );
}
