"use client";

import AdminSidebar from '@/components/admin/sidebar'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
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
  UserPlus
} from "lucide-react";

/* -------------------- Dummy Metrics Data -------------------- */
const dashboardMetrics = [
  {
    title: "Total Users",
    value: "12,450",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Courses",
    value: "86",
    change: "+4%",
    trend: "up",
    icon: BookOpen,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    title: "Revenue",
    value: "$24,800",
    change: "+8%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "Active Students",
    value: "3,120",
    change: "±0%",
    trend: "neutral",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
];

/* -------------------- Dummy Revenue Chart Data -------------------- */
const revenueData = [
  { name: "Jan", revenue: 1200 },
  { name: "Feb", revenue: 2100 },
  { name: "Mar", revenue: 1600 },
  { name: "Apr", revenue: 2400 },
  { name: "May", revenue: 3100 },
  { name: "Jun", revenue: 2800 },
  { name: "Jul", revenue: 3500 },
];

/* -------------------- Dummy Recent Activity Data -------------------- */
const recentActivity = [
  {
    id: 1,
    user: "John Carter",
    action: "completed",
    target: "React Basics Course",
    time: "2h ago",
    color: "text-green-600 bg-green-100",
    icon: CheckCircle,
  },
  {
    id: 2,
    user: "Alice Morgan",
    action: "enrolled in",
    target: "Next.js Mastery",
    time: "5h ago",
    color: "text-blue-600 bg-blue-100",
    icon: UserPlus,
  },
  {
    id: 3,
    user: "David Kim",
    action: "uploaded",
    target: "New Tutorial Video",
    time: "1d ago",
    color: "text-purple-600 bg-purple-100",
    icon: Video,
  },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fullText = 'Your ultimate e-learning platform';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100);

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
            <span className="text-sm text-slate-500">
              Last updated: Today, 10:42 AM
            </span>
          </div>

          {/* METRICS GRID */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {dashboardMetrics.map((metric, index) => (
              <motion.div key={index} variants={item}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                      <div className={cn("p-2 rounded-lg", metric.bg)}>
                        <metric.icon className={cn("h-4 w-4", metric.color)} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <div className="text-2xl font-bold text-slate-900">
                        {metric.value}
                      </div>
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        metric.trend === "up"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      )}>
                        {metric.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* GRID WITH CHART + ACTIVITY */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

            {/* CHART */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis stroke="#64748b" tickFormatter={(v) => `$${v}`} />

                        <Tooltip />

                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3b82f6"
                          fill="url(#colorRevenue)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
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
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center">
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full border",
                            activity.color.replace("text-", "border-")
                          )}
                        >
                          <activity.icon className={cn("h-4 w-4", activity.color.split(" ")[0])} />
                        </div>

                        <div className="ml-4">
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-sm text-slate-500">
                            {activity.action}{" "}
                            <span className="font-medium">{activity.target}</span>
                          </p>
                        </div>

                        <div className="ml-auto text-xs text-slate-400">{activity.time}</div>
                      </div>
                    ))}
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
