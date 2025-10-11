"use client"

import type { Slot } from "@/app/teacher/slots/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Video } from "lucide-react"


function formatTime12Hour(time24: string) {
  const [hourStr, min] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${min} ${ampm}`;
}

export default function UpcomingTab({ slots }: { slots: Slot[] }) {
  if (!slots.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No upcoming meetings.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {slots.map((s) => (
        <Card key={s.id}>
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {new Date(s.dateKey).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </CardTitle>
              <CardTitle className="text-base">
                {formatTime12Hour(s.startISO)} - {formatTime12Hour(s.endISO)}
              </CardTitle>
            </div>

            {s.status === "booked" && (
              <Badge className="bg-blue-600 text-white">Booked</Badge>
            )}
          </CardHeader>

          <CardContent className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">
                {s.student?.name}{" "}
                <span className="text-muted-foreground">• {s.course?.title}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {s.student?.email}
              </div>
            </div>


            <div className="flex items-center gap-2">
              <Button variant="secondary" aria-label="Send message" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button variant="default" aria-label="Join meeting" className="flex items-center gap-1">
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
