"use client"

import { useMemo, useState } from "react"
import type { Slot } from "@/app/teacher/slots/page"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import StudentDetailsDialog from "./student-details-dialog"
import { convertTo12Hour } from "@/utils/timeConverter"

type Grouped = Record<string, Slot[]>



function fmtDayTitle(dateKey: string) {
  const [year, month, day] = dateKey.split("-")
  const isoString = `${year}-${month}-${day}` 
  const d = new Date(isoString)
  if (isNaN(d.getTime())) return "Invalid Date"
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(d)
  const md = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d)
  return `${weekday}, ${md}`
}



function statusBadge(status: Slot["status"]) {
  // Keep to 3-5 color system: neutrals + primary + success/warn/danger accents
  switch (status) {
    case "booked":
      return <Badge className="bg-green-600 text-white hover:bg-green-600">Booked</Badge>
    case "cancelled":
      return <Badge className="bg-red-600 text-white hover:bg-red-600">Cancelled</Badge>
    case "rescheduled":
      return <Badge className="bg-yellow-600 text-white hover:bg-yellow-600">Rescheduled</Badge>
    default:
      return <Badge variant="outline">Available</Badge>
  }
}

export default function SlotsTab({ slots }: { slots: Slot[] }) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const grouped = useMemo(() => {
    return slots.reduce<Grouped>((acc, s) => {
      acc[s.dateKey] ||= []
      acc[s.dateKey].push(s)
      return acc
    }, {})
  }, [slots])

  const dayKeys = useMemo(() => Object.keys(grouped).sort(), [grouped])

  return (
    <>
      <div className="space-y-8">
        
        {dayKeys.map((dk) => (
          <section key={dk} aria-labelledby={`day-${dk}`} className="rounded-lg border">
            <div className="flex items-center justify-between border-b p-4">
              <h2 id={`day-${dk}`} className="text-lg font-medium text-foreground">
                {fmtDayTitle(dk)}
              </h2>
              <div className="text-sm text-muted-foreground">{grouped[dk].length} slots</div>
            </div>

            {/* Mobile-first vertical list; enhanced to grid on md+ */}
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {grouped[dk].map((slot) => (
                  <Card key={slot._id} className="transition-colors">
                    <CardContent className="flex items-center justify-between gap-4 p-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {convertTo12Hour(slot.startISO )} - {convertTo12Hour(slot.endISO)}
                        </p>
                        
                        <div className="mt-1">{statusBadge(slot.status)}</div>
                      </div>

                      {slot.status !== "available" ? (
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedSlot(slot)}
                          aria-label="Open student details"
                        >
                          Student Details
                        </Button>
                      ) : (
                        <div className="text-xs text-muted-foreground">No actions</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <Separator className="my-6" />



      <StudentDetailsDialog slot={selectedSlot} onOpenChange={(open) => !open && setSelectedSlot(null)} />
    </>
  )
}
