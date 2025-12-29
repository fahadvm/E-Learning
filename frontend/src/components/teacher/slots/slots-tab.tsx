"use client"

import { useMemo, useState } from "react"
import type { Slot } from "@/app/teacher/slots/page"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock } from "lucide-react"
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
      <div className="space-y-10">

        {dayKeys.map((dk) => (
          <section key={dk} aria-labelledby={`day-${dk}`} className="rounded-[2rem] border border-zinc-100 bg-zinc-50/30 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-100 p-6 bg-white">
              <h2 id={`day-${dk}`} className="text-xl font-black text-black tracking-tight">
                {fmtDayTitle(dk)}
              </h2>
              <Badge variant="outline" className="font-bold border-zinc-200 text-zinc-500 uppercase tracking-tight">
                {grouped[dk].length} Slots
              </Badge>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {grouped[dk].map((slot) => (
                  <Card key={slot._id} className="border-0 shadow-sm ring-1 ring-zinc-200 hover:ring-black transition-all rounded-2xl overflow-hidden bg-white">
                    <CardContent className="flex flex-col p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-zinc-50 rounded-xl">
                          <Clock className="w-4 h-4 text-black" />
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-black">
                            {convertTo12Hour(slot.startISO)}
                          </p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                            {convertTo12Hour(slot.endISO)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2">
                        <div>{statusBadge(slot.status)}</div>
                        {slot.status !== "available" ? (
                          <Button
                            onClick={() => setSelectedSlot(slot)}
                            className="bg-black text-white hover:bg-zinc-800 text-[10px] h-8 px-4 font-black rounded-lg transition-all"
                            aria-label="Open student details"
                          >
                            Details
                          </Button>
                        ) : (
                          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest italic">Open</span>
                        )}
                      </div>
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
