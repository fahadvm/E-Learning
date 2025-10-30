import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Target, Zap } from "lucide-react"
import { DashboardChart } from "@/components/employee/dashboard-chart"
import { RecentActivity } from "@/components/employee/recent-activity"

export default function EmployeeHome() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Sarah!</h1>
        <p className="text-muted-foreground mt-2">Here's your learning progress for this week</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Courses</p>
              <p className="text-3xl font-bold mt-2">5</p>
            </div>
            <BookOpen className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Learning Hours</p>
              <p className="text-3xl font-bold mt-2">24.5</p>
            </div>
            <Clock className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-3xl font-bold mt-2">68%</p>
            </div>
            <Target className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="text-3xl font-bold mt-2">12 days</p>
            </div>
            <Zap className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
      </div>

      {/* Daily Goal Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Today's Learning Goal</h3>
            <p className="text-sm text-muted-foreground">45 minutes target</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-semibold">28 / 45 minutes</span>
            </div>
            <Progress value={62} className="h-2" />
          </div>
          <Button className="w-full">Continue Learning</Button>
        </div>
      </Card>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardChart />
        </div>
        <RecentActivity />
      </div>

      {/* Assigned Courses */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Your Assigned Courses</h3>
        <div className="space-y-4">
          {[
            { title: "Advanced React Patterns", progress: 75, dueDate: "Dec 15" },
            { title: "TypeScript Mastery", progress: 45, dueDate: "Dec 20" },
            { title: "Web Performance", progress: 20, dueDate: "Dec 25" },
          ].map((course, idx) => (
            <div key={idx} className="space-y-2 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{course.title}</p>
                  <p className="text-xs text-muted-foreground">Due: {course.dueDate}</p>
                </div>
                <span className="text-sm font-semibold text-primary">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
