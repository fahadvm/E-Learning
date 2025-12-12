"use client";

import { useState, useEffect } from "react";
import Header from "@/components/company/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showErrorToast } from "@/utils/Toast";

export default function TrackerPage() {
  const [range, setRange] = useState<"week" | "month" | "year">("month");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackerData();
  }, [range]);

  const fetchTrackerData = async () => {
    try {
      setLoading(true);
      const res = await companyApiMethods.getTrackerStats(range);
      setStats(res.data);
    } catch (error: any) {
      console.error("Failed to fetch tracker stats:", error);
      showErrorToast(error?.response?.data?.message || "Failed to load tracker data");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Reusable background UI like leaderboard page
  const Background = () => (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/20 to-slate-900" />
      <div className="fixed inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="fixed w-px h-px bg-white/70 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>
    </>
  );

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
        <Background />
        <div className="relative z-10">
          <Header />
          <main className="flex h-[80vh] items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-400">Loading tracker data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
        <Background />
        <div className="relative z-10">
          <Header />
          <main className="flex h-[80vh] items-center justify-center">
            <p className="text-gray-400">No data available</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      <Background />

      <div className="relative z-10">
        <Header />

        <main className="px-6 pt-20 pb-32">
          <div className="max-w-6xl mx-auto space-y-12">

            {/* 📌 Page Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Learning Tracker</h1>
                <p className="text-gray-400 mt-2">
                  Monitor engagement & performance across your organization
                </p>
              </div>

              {/* 🔥 Range Buttons */}
              <div className="flex gap-3 bg-white/5 border border-white/10 p-2 rounded-xl backdrop-blur-xl">
                {(["week", "month", "year"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-5 py-2 rounded-lg transition-all font-semibold ${
                      range === r
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* 📊 Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Employees", value: stats.totalEmployees },
                { title: "Total Learning Hours", value: stats.totalLearningHours + "h" },
                { title: "Average Completion Rate", value: stats.avgCompletionRate + "%" },
                { title: "Active Courses", value: stats.totalCourses },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="bg-white/5 text-white border-white/10 backdrop-blur-xl hover:border-primary/40 transition p-4"
                >
                  <CardContent className="pt-4">
                    <p className="text-gray-400 text-sm">{item.title}</p>
                    <p className="text-4xl font-bold mt-1">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 📈 Learning Activity Chart */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white">
              <CardHeader>
                <CardTitle className="text-white">Learning Hours Trend</CardTitle>
                <CardDescription className="text-gray-400">
                  Based on selected time range
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.graph?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={stats.graph}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                      <XAxis dataKey="label" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip contentStyle={{ background: "#0f172a", borderRadius: "8px" }} />
                      <Bar dataKey="hours" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    No activity data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 🔥 Most Active Learners */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white">
              <CardHeader>
                <CardTitle>Top 10 Most Active Learners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.mostActive?.length ? (
                  stats.mostActive.map((u: any) => (
                    <div
                      key={u.id}
                      className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <p className="font-medium">{u.name}</p>
                      <p className="text-gray-400 text-sm">
                        {u.hours}h • {u.progress}%
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-4">No active learners</p>
                )}
              </CardContent>
            </Card>

            {/* ❄ Least Active Learners */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white">
              <CardHeader>
                <CardTitle>10 Least Active Learners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.leastActive?.length ? (
                  stats.leastActive.map((u: any) => (
                    <div
                      key={u.id}
                      className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <p className="font-medium">{u.name}</p>
                      <p className="text-gray-400 text-sm">
                        {u.hours}h • {u.progress}%
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-4">No data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
