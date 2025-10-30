"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
} from "recharts"
import { TrendingUp, Award, Target, Calendar } from "lucide-react"

const monthlyData = [
  { month: "Jan", hours: 8, courses: 1 },
  { month: "Feb", hours: 12, courses: 2 },
  { month: "Mar", hours: 15, courses: 2 },
  { month: "Apr", hours: 18, courses: 3 },
  { month: "May", hours: 22, courses: 3 },
  { month: "Jun", hours: 24.5, courses: 5 },
]

const courseProgress = [
  { name: "Completed", value: 1, color: "var(--chart-1)" },
  { name: "In Progress", value: 3, color: "var(--chart-2)" },
  { name: "Not Started", value: 2, color: "var(--chart-3)" },
]

const detailedCourses = [
  {
    title: "Advanced React Patterns",
    progress: 75,
    hoursSpent: 9,
    totalHours: 12,
    lastAccessed: "Today",
    quizScore: 85,
  },
  {
    title: "TypeScript Mastery",
    progress: 45,
    hoursSpent: 6.75,
    totalHours: 15,
    lastAccessed: "2 days ago",
    quizScore: 78,
  },
  {
    title: "Web Performance Optimization",
    progress: 20,
    hoursSpent: 1.6,
    totalHours: 8,
    lastAccessed: "5 days ago",
    quizScore: null,
  },
  {
    title: "Node.js Best Practices",
    progress: 100,
    hoursSpent: 10,
    totalHours: 10,
    lastAccessed: "1 week ago",
    quizScore: 92,
  },
]

export default function ProgressPage() {
  const totalHours = detailedCourses.reduce((sum, c) => sum + c.hoursSpent, 0)
  const avgScore =
    detailedCourses.filter((c) => c.quizScore).reduce((sum, c) => sum + (c.quizScore || 0), 0) /
    detailedCourses.filter((c) => c.quizScore).length

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground mt-2">Track your learning journey and achievements</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Learning Hours</p>
              <p className="text-3xl font-bold mt-2">{totalHours.toFixed(1)}</p>
            </div>
            <Calendar className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Courses Completed</p>
              <p className="text-3xl font-bold mt-2">1</p>
            </div>
            <Award className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Quiz Score</p>
              <p className="text-3xl font-bold mt-2">{avgScore.toFixed(0)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-3xl font-bold mt-2">60%</p>
            </div>
            <Target className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Progress */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Monthly Learning Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="hours" fill="var(--chart-1)" name="Learning Hours" />
              <Bar dataKey="courses" fill="var(--chart-2)" name="Courses" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Course Status Distribution */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Course Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseProgress}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {courseProgress.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Course Progress */}
      <Card className="p-6">
        <h3 className="font-semibold mb-6">Detailed Course Progress</h3>
        <div className="space-y-6">
          {detailedCourses.map((course, idx) => (
            <div key={idx} className="pb-6 border-b border-border last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{course.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.hoursSpent} / {course.totalHours} hours • Last accessed: {course.lastAccessed}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{course.progress}%</p>
                  {course.quizScore && <p className="text-sm text-muted-foreground">Quiz: {course.quizScore}%</p>}
                </div>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs for Different Views */}
      <Card className="p-6">
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-6 space-y-4">
            <div className="space-y-3">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, idx) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{day}</span>
                  <div className="flex-1 mx-4 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.random() * 100}%` }} />
                  </div>
                  <span className="text-sm text-muted-foreground">{(Math.random() * 4).toFixed(1)}h</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-6">
            <p className="text-muted-foreground">Monthly view data coming soon</p>
          </TabsContent>

          <TabsContent value="yearly" className="mt-6">
            <p className="text-muted-foreground">Yearly view data coming soon</p>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
