"use client"

import type { Slot } from "@/app/teacher/slots/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function fmtWhen(startISO: string, endISO: string) {
  const s = new Date(startISO)
  const e = new Date(endISO)
  const day = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(s)
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(s)
  const timeEnd = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(e)
  return `${day} • ${time} – ${timeEnd}`
}

export default function UpcomingTab({ slots }: { slots: Slot[] }) {
  if (!slots.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">No upcoming meetings.</CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {slots.map((s) => (
        <Card key={s.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{fmtWhen(s.startISO, s.endISO)}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">
                {s.student?.name} <span className="text-muted-foreground">• {s.student?.course}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.student?.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white hover:bg-green-600">Booked</Badge>
              <Button variant="default" aria-label="Join meeting">
                Quick Join
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
