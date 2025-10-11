"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SlotsTab from "@/components/teacher/slots/slots-tab"
import UpcomingTab from "@/components/teacher/slots/upcoming-tab"
import Header from "@/components/teacher/header"
import { teacherCallRequestApi } from "@/services/APImethods/teacherAPImethods"

type SlotStatus = "booked" | "cancelled" | "requested" | "available" | "approved" | "paid"

export type Student = {
  name: string
  email: string
}
export type Course = {
  title: string
}

export type Slot = {
  id: string
  dateKey: string
  startISO: string
  endISO: string
  status: SlotStatus
  student?: Student
  course?: Course
}

// Backend item type (for clarity; optional but recommended)
type BackendSlot = {
  date: string
  day: string
  slot: {
    start: string  // "HH:MM"
    end: string    // "HH:MM"
    _id: string
  }
  status: SlotStatus
  student?: Student  // Optional; present only in "booked"
  course?: Student  // Optional; present only in "booked"
}

export default function Page() {
  const [allSlots, setAllSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSlots() {
      try {
        const res = await teacherCallRequestApi.getslotsList()
        console.log("respomses in slot page is ", res.data)

        // Transform backend data to Slot[]
        const transformedSlots: Slot[] = res.data.map((item: BackendSlot) => {
          const date = item.date
          const startTime = item.slot.start
          const endTime = item.slot.end

          // Combine date + time into ISO strings (assume local TZ, add :00 seconds)
          const startISO = startTime
          const endISO = endTime

          return {
            id: item.slot._id,
            dateKey: date,
            startISO,
            endISO,
            status: item.status,
            student: item.student,  // Undefined for "available"; assume backend adds for "booked"
            course: item.course  // Undefined for "available"; assume backend adds for "booked"
          }
        })

        console.log("Transformed slots:", transformedSlots)  // Debug: Verify structure
        setAllSlots(transformedSlots)
      } catch (err) {
        console.error("Failed to load slots", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSlots()
  }, [])

  const bookedUpcoming = allSlots.filter((s) => s.status === "paid")

  return (
    <>
      <Header />
      <main className="mx-auto full-w px-4 py-8">
        <header className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground">
              Video Meet Slots
            </h1>
            <p className="text-muted-foreground">
              Manage availability and view your upcoming meetings.
            </p>
          </div>
        </header>

        <Card>
          <CardHeader className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-pretty">Schedule</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p>Loading slots...</p>
            ) : (
              <Tabs defaultValue="slots" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="slots">Slots</TabsTrigger>
                  <TabsTrigger value="upcoming">Booked Slots (Upcoming)</TabsTrigger>
                </TabsList>

                <TabsContent value="slots" className="mt-6">
                  <SlotsTab slots={allSlots} />
                </TabsContent>

                <TabsContent value="upcoming" className="mt-6">
                  <UpcomingTab slots={bookedUpcoming} />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
} 