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
      <DialogContent className="sm:max-w-md border-0 shadow-2xl rounded-[2.5rem] p-8 overflow-hidden bg-white">
        <DialogHeader className="mb-6">
          <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">S</span>
            </div>
          </div>
          <DialogTitle className="text-2xl font-black text-black">Student Details</DialogTitle>
          <DialogDescription className="font-medium text-zinc-400">View performance and booking information for this session.</DialogDescription>
        </DialogHeader>

        {slot && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <span className="text-xs font-black uppercase text-zinc-400 tracking-widest">Status</span>
              {statusBadge(slot.status)}
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm">
              <DetailRow label="Meeting Date" value={slot.dateKey.split("-").reverse().join("-")} />
              <DetailRow label="Schedule" value={`${slot.startISO} - ${slot.endISO}`} />
              <DetailRow label="Student Name" value={slot.student?.name ?? "-"} />
              <DetailRow label="Contact Email" value={slot.student?.email ?? "-"} />
              <DetailRow label="Enrolled Course" value={slot.course?.title ?? "-"} isLast />
            </div>
          </div>
        )}

        <DialogFooter className="mt-8">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-black text-white hover:bg-zinc-800 font-bold h-12 rounded-xl shadow-lg"
          >
            Close Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DetailRow({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1 ${!isLast ? 'border-b border-zinc-50 pb-3' : ''}`}>
      <span className="text-[10px] font-black uppercase text-zinc-400 tracking-tight">{label}</span>
      <span className="text-sm font-bold text-black">{value}</span>
    </div>
  );
}
