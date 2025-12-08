"use client"

import type { Slot } from "@/app/teacher/slots/page"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function StudentDetailsDialog({
  slot,
  onOpenChange,
}: {
  slot: Slot | null
  onOpenChange: (open: boolean) => void
}) {
  const open = !!slot

  // const when = useMemo(() => {
  //   if (!slot) return ""
  //   const s = new Date(slot.startISO)
  //   const e = new Date(slot.endISO)
  //   const d = new Intl.DateTimeFormat("en-US", {
  //     weekday: "long",
  //     month: "short",
  //     day: "numeric",
  //     year: "numeric",
  //   }).format(s)
  //   const t = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(s)
  //   const te = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(e)
  //   return `${d} • ${t} – ${te}`
  // }, [slot])

  function statusBadge(status: Slot["status"]) {
    switch (status) {
      case "booked":
        return <Badge className="bg-green-600 text-white hover:bg-green-600">Booked</Badge>
      case "cancelled":
        return <Badge className="bg-red-600 text-white hover:bg-red-600">Cancelled</Badge>
      case "rescheduled":
        return <Badge className="bg-amber-500 text-white hover:bg-amber-500">Rescheduled</Badge>
      default:
        return <Badge variant="outline">Available</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
          <DialogDescription>View information and manage booking for this slot.</DialogDescription>
        </DialogHeader>

        {slot && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Status</div>
              {statusBadge(slot.status)}
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground"> {slot.dateKey.split("-").reverse().join("-")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">{slot.startISO} - {slot.endISO}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Student</span>
                <span className="font-medium text-foreground">{slot.student?.name ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">{slot.student?.email?? "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Course</span>
                <span className="font-medium text-foreground">{slot.course?.title?? "-"}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-5 sm:gap-2">
          {/* {slot?.status === "booked" ? (
            // <Button variant="destructive" onClick={() => alert("Cancel booking (wire to API)")}>
            //   Reschedule Booking
            // </Button>
          ) : (
            <div className="text-xs text-muted-foreground">No actions available for this status.</div>
          )} */}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
