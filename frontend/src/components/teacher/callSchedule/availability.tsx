"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"
import { teacherAvailabilityApi } from "@/services/APIservices/teacherApiService"
import { showSuccessToast } from "@/utils/Toast"
import ConfirmationDialog from "@/reusable/ConfirmationDialog"

type TimeSlot = { id: string; start: string; end: string }
type DayAvailability = { day: string; enabled: boolean; slots: TimeSlot[] }

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const

// Generate 30-min time ranges
function generateTimeRanges() {
  const ranges: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const startH = String(h).padStart(2, "0")
      const startM = String(m).padStart(2, "0")
      let endH = h
      let endM = m + 30
      if (endM === 60) {
        endM = 0
        endH += 1
      }
      if (endH === 24) endH = 0
      ranges.push(`${startH}:${startM} - ${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`)
    }
  }
  return ranges
}

// Format range label for display
function formatRangeLabel(range: string) {
  const [start, end] = range.split(" - ")
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)

  const format = (h: number, m: number) => {
    const period = h >= 12 ? "PM" : "AM"
    const hour = ((h + 11) % 12) + 1
    return `${hour}:${String(m).padStart(2, "0")} ${period}`
  }

  return `${format(sh, sm)} - ${format(eh, em)}`
}

export default function AvailabilityScheduler() {
  const timeRanges = useMemo(() => generateTimeRanges(), [])
  const [week, setWeek] = useState<DayAvailability[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch availability on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await teacherAvailabilityApi.getAvailability()
        const week = res?.data?.week || []   // safe extract

        console.log("coming data is ", week)

        if (week.length) {
          const mapped = DAYS.map((day) => {
            const dayData = week.find((d: any) => d.day === day)
            return {
              day,
              enabled: dayData?.enabled || false,
              slots: dayData ? dayData.slots.map((s: any) => ({ id: crypto.randomUUID(), ...s })) : [],
            }
          })
          setWeek(mapped)
        } else {
          setWeek(DAYS.map((d) => ({ day: d, enabled: false, slots: [] })))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const toggleDay = (day: string, enabled: boolean) => {
    setWeek((prev) =>
      prev.map((d) =>
        d.day === day ? { ...d, enabled, slots: enabled ? d.slots : [] } : d
      )
    )
  }

  const updateSlot = (day: string, slotId: string, start: string, end: string) => {
    setWeek((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, slots: d.slots.map((s) => (s.id === slotId ? { ...s, start, end } : s)) }
          : d
      )
    )
  }

  const addSlot = (day: string) => {
    setWeek((prev) =>
      prev.map((d) =>
        d.day === day && d.slots.length < 4
          ? { ...d, slots: [...d.slots, { id: crypto.randomUUID(), start: "09:00", end: "09:30" }] }
          : d
      )
    )
  }

  const removeSlot = (day: string, slotId: string) => {
    setWeek((prev) =>
      prev.map((d) => (d.day === day ? { ...d, slots: d.slots.filter((s) => s.id !== slotId) } : d))
    )
  }

  const onSave = async () => {
    try {
      const payload = {
        week: week.map((d) => ({
          day: d.day,
          enabled: d.enabled,
          slots: d.slots.map((s) => ({ start: s.start, end: s.end }))
        }))
      };

      const res = await teacherAvailabilityApi.saveAvailability(payload)
      if (res.ok) {
        showSuccessToast("Availability saved successfully")
      }
    } catch (err) {
      console.error(err)

    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="space-y-6">
      <Card className="bg-card/70 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-base font-semibold">Weekly Schedule</h3>
          <p className="text-sm text-muted-foreground">Enable your availability by day. Add multiple time ranges where needed.</p>

          <div className="mt-4 divide-y divide-border rounded-lg border">
            {week.map((d) => (
              <div key={d.day} className="grid grid-cols-1 gap-4 p-4 md:grid-cols-12 md:items-start">
                <div className="md:col-span-3">
                  <div className="flex items-center justify-between md:block">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={d.enabled}
                        onCheckedChange={(checked) => toggleDay(d.day, checked)}
                        className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-black"
                      />
                      <span className="font-medium">{d.day}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-9">
                  {d.enabled ? (
                    <div className="space-y-3">
                      {d.slots.map((s) => (
                        <div key={s.id} className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                          <Select
                            value={`${s.start} - ${s.end}`}
                            onValueChange={(v) => {
                              const [start, end] = v.split(" - ")
                              updateSlot(d.day, s.id, start, end)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Slot" />
                            </SelectTrigger>
                            <SelectContent className="max-h-64">
                              {timeRanges.map((range) => (
                                <SelectItem key={range} value={range}>
                                  {formatRangeLabel(range)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="self-start text-destructive"
                            onClick={() => removeSlot(d.day, s.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        onClick={() => addSlot(d.day)}
                        disabled={d.slots.length >= 4}
                      >
                        <Plus className="h-4 w-4" />
                        Add More Slots
                      </Button>
                      {d.slots.length >= 4 && <p className="text-xs text-destructive mt-1">Max 4 slots per day</p>}
                    </div>
                  ) : (
                    <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                      Availability disabled for {d.day}. Toggle on to add time slots.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <ConfirmationDialog
              title="Save Availability"
              description="Are you sure you want to save your weekly availability?"
              confirmText="Save"
              cancelText="Cancel"
              onConfirm={onSave} 
              triggerButton={
                <Button>Save Availability</Button> 
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
