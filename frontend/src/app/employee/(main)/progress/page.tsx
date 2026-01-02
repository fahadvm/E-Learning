"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Award, Target, Calendar, Clock, Users, Building2, ArrowRight } from "lucide-react";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { useEmployee } from "@/context/employeeContext";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/utils/timeConverter";

/* ──────────────────────── Interfaces ──────────────────────── */
import { IEmployeeLearningRecord, ICourseProgress } from "@/types/employee/employeeTypes";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name?: string; value?: number }[];
}


/* ──────────────────────── Helpers ──────────────────────── */
const formatHours = (minutes: number) => (minutes / 60).toFixed(1);

const AnimatedNumber = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 800;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(progress * value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <>{display.toFixed(value % 1 === 0 ? 0 : 1)}</>;
};

/* ────── Date Helpers ────── */




const getWeeklyData = (records: IEmployeeLearningRecord[]) => {
  const now = new Date();

  // Get array of past 7 days (today + previous 6 days)
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - i)); // ensures chronological order (oldest → newest)
    return date;
  });

  const dayMap = new Map<string, number>();
  days.forEach((d) => dayMap.set(d.toISOString().split("T")[0], 0));

  records.forEach((rec) => {
    const recDate = new Date(rec.date).toISOString().split("T")[0];
    if (dayMap.has(recDate)) {
      dayMap.set(recDate, (dayMap.get(recDate) || 0) + rec.totalMinutes);
    }
  });

  return days.map((date) => {
    const key = date.toISOString().split("T")[0];
    const minutes = dayMap.get(key) || 0;
    return {
      day: date.toLocaleDateString("en", { weekday: "long" }),
      short: date.toLocaleDateString("en", { weekday: "short" }),
      hours: parseFloat((minutes / 60).toFixed(1)),
      minutes,
      date: key,
    };
  });
};


/* ────── Monthly (All 12 months of this year) ────── */
const getMonthlyData = (records: IEmployeeLearningRecord[]) => {
  const now = new Date();
  const year = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 = Jan, 10 = Nov, etc.
  const monthMap = new Map<number, number>();

  // initialize all months up to current month with 0
  for (let i = 0; i <= currentMonth; i++) monthMap.set(i, 0);

  records.forEach((rec) => {
    const d = new Date(rec.date);
    if (d.getFullYear() === year) {
      const month = d.getMonth();
      if (month <= currentMonth) {
        monthMap.set(month, (monthMap.get(month) || 0) + rec.totalMinutes);
      }
    }
  });

  // Return only months up to current month
  return Array.from({ length: currentMonth + 1 }, (_, i) => ({
    month: new Date(year, i).toLocaleString("default", { month: "short" }),
    hours: parseFloat(((monthMap.get(i) || 0) / 60).toFixed(1)),
  }));
};


/* ────── Yearly (Past 5 years, even with 0) ────── */
const getYearlyData = (records: IEmployeeLearningRecord[]) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i); // last 5 years
  const yearMap = new Map<number, number>();
  years.forEach((y) => yearMap.set(y, 0));

  records.forEach((rec) => {
    const d = new Date(rec.date);
    const year = d.getFullYear();
    if (yearMap.has(year)) {
      yearMap.set(year, (yearMap.get(year) || 0) + rec.totalMinutes);
    }
  });

  return years.map((year) => ({
    year,
    hours: parseFloat(((yearMap.get(year) || 0) / 60).toFixed(1)),
  }));
};


/* ────── Custom Tooltip ────── */
const ChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <p className="text-sm font-medium">{name}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
};

/* ──────────────────────── Main Component ──────────────────────── */
export default function ProgressPage() {
  const [records, setRecords] = useState<IEmployeeLearningRecord[]>([]);
  const [progress, setProgress] = useState<ICourseProgress[]>([]);
  const { employee } = useEmployee();
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const fetchData = async () => {
      if (!employee?._id) return;
      try {
        const [recRes, progRes] = await Promise.all([
          employeeApiMethods.getLearningRecord(),
          employeeApiMethods.getProgression(),
        ]);

        if (recRes?.ok && recRes.data) {
          const recordsData = Array.isArray(recRes.data)
            ? recRes.data
            : (recRes.data as { records: IEmployeeLearningRecord[] }).records || [];
          setRecords(recordsData);
        }

        if (progRes?.ok && progRes.data) {
          const progressData = Array.isArray(progRes.data)
            ? progRes.data
            : (progRes.data as { progress: ICourseProgress[] }).progress || [];
          setProgress(progressData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [employee?._id]);



  //weekly = today - one week ego
  //monthly = each months in year
  //yearly means page past 5 year
  const weeklyData = useMemo(() => getWeeklyData(records), [records]);
  const monthlyDataTab = useMemo(() => getMonthlyData(records), [records]);
  const yearlyData = useMemo(() => getYearlyData(records), [records]);

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="animate-pulse text-muted-foreground">Loading progress…</p>
      </div>
    );

  if (!employee?.companyId) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center text-center px-6">
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

  if (!records.length && !progress.length)
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">No progress data yet.</p>
      </div>
    );

  const totalMinutes = records.reduce((a, r) => a + (r.totalMinutes ?? 0), 0);
  const totalHours = formatHours(totalMinutes);
  const completedCnt = progress.filter((p) => p.percentage === 100).length;
  const activeCnt = progress.length ?? 0;
  const overallPct =
    progress.length > 0
      ? Math.round(
        progress.reduce((a, c) => a + c.percentage, 0) / progress.length
      )
      : 0;

  /* Monthly Data for Charts */
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 5);

  const monthlyMap = new Map<string, { hours: number; courses: number }>();
  records.forEach((rec) => {
    const d = new Date(rec.date);
    if (d >= sixMonthsAgo && d <= now) {
      const month = d.toLocaleString("default", { month: "short" });
      const cur = monthlyMap.get(month) ?? { hours: 0, courses: 0 };
      cur.hours += (rec.totalMinutes ?? 0) / 60;
      cur.courses += rec.courses.length;
      monthlyMap.set(month, cur);
    }
  });

  const pastSix = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now);
    d.setMonth(now.getMonth() - (5 - i));
    return d.toLocaleString("default", { month: "short" });
  });

  const monthlyData = pastSix.map((m) => ({
    month: m,
    hours: parseFloat((monthlyMap.get(m)?.hours ?? 0).toFixed(1)),
    courses: monthlyMap.get(m)?.courses ?? 0,
  }));

  /* Pie Data */
  const pieRaw = [
    { name: "Completed", value: completedCnt, color: "#22c55e" },
    {
      name: "In Progress",
      value: progress.filter((p) => p.percentage > 0 && p.percentage < 100).length,
      color: "#3b82f6",
    },
    {
      name: "Not Started",
      value: progress.filter((p) => p.percentage === 0).length,
      color: "#f97316",
    },
  ];
  const pieData = pieRaw.filter((d) => d.value > 0);
  const hasPieData = pieData.length > 0;

  /* Tabs */

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 md:p-8">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Your Learning Journey
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track every minute, every course, every achievement.
        </p>
      </header>

      {/* Stat Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Calendar, label: "Total Learning Hours", value: parseFloat(totalHours), suffix: "h" },
          { icon: Award, label: "Courses Completed", value: completedCnt },
          { icon: TrendingUp, label: "Active Courses", value: activeCnt },
          { icon: Target, label: "Overall Progress", value: overallPct, suffix: "%" },
        ].map((stat, i) => (
          <Card
            key={i}
            className={cn(
              "group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
              "border bg-card/80 backdrop-blur-sm"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-primary opacity-70 transition-opacity group-hover:opacity-100" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  <AnimatedNumber value={stat.value} />
                </span>
                {stat.suffix && <span className="text-lg font-medium">{stat.suffix}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-10">
        <Card className="overflow-hidden border bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5" />
              Today’s Learning Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const today = new Date();
              const todayRec = records.find((r) => {
                const recDate = new Date(r.date);
                return recDate.toDateString() === today.toDateString();
              });

              if (!todayRec) {
                return (
                  <p className="text-center text-muted-foreground">
                    No activity recorded today.
                  </p>
                );
              }

              const totalMins = todayRec.totalMinutes;
              const hrs = Math.floor(totalMins / 60);
              const mins = totalMins % 60;

              return (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Time spent</span>
                    <span className="text-2xl font-bold text-primary">
                      {hrs ? `${hrs}h ` : ""}{Math.floor(mins)}m
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">
                      Courses ({todayRec.courses.length})
                    </p>
                    {todayRec.courses.map((c, i) => {
                      const courseTitle =
                        progress.find((p) => p.courseId?._id === c.courseId)?.courseId?.title ||
                        `Course #${i + 1}`;
                      const cHrs = Math.floor(c.minutes / 60);
                      const cMins = Math.floor(c.minutes % 60);
                      return (
                        <div
                          key={c.courseId}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="truncate max-w-[70%]">{courseTitle}</span>
                          <span className="font-mono text-muted-foreground">
                            {cHrs ? `${cHrs}h ` : ""}{cMins}m
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </section>

      {/* Charts */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Learning Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fill: "var(--muted-foreground)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "12px" }} iconType="circle" />
                <Bar dataKey="hours" fill="#3b82f6" name="Learning Hours" radius={[4, 4, 0, 0]} />
                <Bar dataKey="courses" fill="#22c55e" name="Courses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Course Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                {hasPieData ? (
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                ) : (
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-muted-foreground text-sm"
                  >
                    No progress data
                  </text>
                )}
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Detailed Course List */}
      <section className="mt-10">
        <Card className="overflow-hidden border bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Detailed Course Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {progress.length === 0 ? (
              <p className="text-center text-muted-foreground">No course progress found.</p>
            ) : (
              progress.map((c, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col gap-3 pb-5",
                    i !== progress.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{c.courseId?.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {c.completedLessons?.length ?? 0} / {c.totalLesson ?? 0} lessons
                        </span>
                        {" • "}
                        Last accessed:{" "}
                        {c.lastVisitedTime ? timeAgo(c.lastVisitedTime) : "No data"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary">{c.percentage}%</p>
                    </div>
                  </div>
                  <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/70 to-primary"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      {/* Dynamic Weekly/Monthly/Yearly Tabs */}
      <Card className="p-6 mt-10">
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>


          <TabsContent value="weekly" className="mt-6 space-y-4">
            {weeklyData.length > 0 ? (
              <Card className="p-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Weekly Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis
                        label={{
                          value: "Hours",
                          angle: -90,
                          position: "insideLeft",
                          style: { textAnchor: "middle" },
                        }}
                      />
                      <Tooltip formatter={(value) => `${value} hrs`} />
                      <Line
                        type="monotone"
                        dataKey="hours"
                        stroke="#3b82f6" // Tailwind blue-500
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#3b82f6" }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : (
              <p className="text-center text-muted-foreground">
                No learning activity this week.
              </p>
            )}
          </TabsContent>

          {/* Monthly Tab */}
          <TabsContent value="monthly" className="mt-6">
            {monthlyDataTab.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyDataTab} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)" }} />
                  <YAxis tick={{ fill: "var(--muted-foreground)" }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "12px" }} iconType="circle" />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#3b82f6" }}
                    activeDot={{ r: 6 }}
                    name="Learning Hours"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground">
                No learning activity this year.
              </p>
            )}
          </TabsContent>

          {/* Yearly Tab */}
          <TabsContent value="yearly" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fill: "var(--muted-foreground)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "12px" }} iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#22c55e" }}
                  activeDot={{ r: 6 }}
                  name="Learning Hours"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
