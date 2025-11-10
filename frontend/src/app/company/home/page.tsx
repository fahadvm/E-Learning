"use client"

import Header from "@/components/company/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
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

// Mock data
const stats = [
  { label: "Total Employees", value: "1,245", change: "+12%", icon: "👥" },
  { label: "Active Courses", value: "48", change: "+8%", icon: "📚" },
  { label: "Learning Paths", value: "23", change: "+5%", icon: "🎯" },
  { label: "Completion Rate", value: "78%", change: "+3%", icon: "✓" },
]

const enrollmentData = [
  { month: "Jan", employees: 120, courses: 8 },
  { month: "Feb", employees: 145, courses: 12 },
  { month: "Mar", employees: 180, courses: 15 },
  { month: "Apr", employees: 210, courses: 18 },
  { month: "May", employees: 245, courses: 22 },
  { month: "Jun", employees: 280, courses: 28 },
]

const departmentData = [
  { name: "Engineering", value: 350, color: "hsl(var(--color-chart-1))" },
  { name: "Sales", value: 280, color: "hsl(var(--color-chart-2))" },
  { name: "HR", value: 120, color: "hsl(var(--color-chart-3))" },
  { name: "Marketing", value: 200, color: "hsl(var(--color-chart-4))" },
  { name: "Operations", value: 295, color: "hsl(var(--color-chart-5))" },
]

const topCourses = [
  { id: 1, name: "Advanced JavaScript", enrollments: 234, completion: 87 },
  { id: 2, name: "Cloud Architecture", enrollments: 198, completion: 76 },
  { id: 3, name: "Leadership Fundamentals", enrollments: 156, completion: 92 },
  { id: 4, name: "Data Science Basics", enrollments: 142, completion: 68 },
  { id: 5, name: "Product Management", enrollments: 128, completion: 85 },
]

export default function DashboardPage() {
  return (
    <div className="h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 mt-10 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Overview of your learning ecosystem</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-primary mt-2">{stat.change} from last month</p>
                      </div>
                      <span className="text-3xl">{stat.icon}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enrollment Trend */}
              <Card className="lg:col-span-2 border-border/50">
                <CardHeader>
                  <CardTitle>Enrollment Trends</CardTitle>
                  <CardDescription>Employee and course enrollment over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={enrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                      <YAxis stroke="var(--color-muted-foreground)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="employees"
                        stroke="var(--color-chart-1)"
                        name="Employees Enrolled"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="courses"
                        stroke="var(--color-chart-2)"
                        name="Courses Active"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Department Distribution */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>By Department</CardTitle>
                  <CardDescription>Employees per department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {departmentData.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Courses */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Top Performing Courses</CardTitle>
                <CardDescription>Most enrolled and highest completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{course.name}</p>
                        <p className="text-sm text-muted-foreground">{course.enrollments} enrollments</p>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{course.completion}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">completion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
