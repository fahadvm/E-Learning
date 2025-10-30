import { Card } from "@/components/ui/card"
import { CheckCircle2, BookOpen, Award } from "lucide-react"

const activities = [
  { type: "completed", text: "Completed React Basics", time: "2 hours ago" },
  { type: "started", text: "Started TypeScript Course", time: "5 hours ago" },
  { type: "achievement", text: "Earned 'Quick Learner' badge", time: "1 day ago" },
]

export function RecentActivity() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, idx) => {
          const Icon = activity.type === "completed" ? CheckCircle2 : activity.type === "achievement" ? Award : BookOpen
          return (
            <div key={idx} className="flex gap-3">
              <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.text}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
