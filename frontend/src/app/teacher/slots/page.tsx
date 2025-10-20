"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SlotsTab from "@/components/teacher/slots/slots-tab"
import UpcomingTab from "@/components/teacher/slots/upcoming-tab"
import HistoryTab from "@/components/teacher/slots/history-tab"
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

type BackendSlot = {
  date: string
  day: string
  slot: {
    start: string
    end: string
    _id: string
  }
  status: SlotStatus
  student?: Student
  course?: Course
}

export default function Page() {
  const [allSlots, setAllSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | undefined>()

  // Fetch available + upcoming slots
  useEffect(() => {
    async function fetchAllSlots() {
      try {
        const res = await teacherCallRequestApi.getslotsList()
        console.log("Slots response:", res.data)

        const transformedSlots: Slot[] = res.data.map((item: BackendSlot) => {
          const { date, slot, status, student, course } = item
          return {
            id: slot._id,
            dateKey: date,
            startISO: slot.start,
            endISO: slot.end,
            status,
            student,
            course
          }
        })

        setAllSlots(transformedSlots)
      } catch (err) {
        console.error("Failed to load slots", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllSlots()
  }, [])

  // Fetch history slots
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await teacherCallRequestApi.getRequestHistory({page, limit, status: statusFilter})
        console.log("Paginated history:", res.data)

        setHistory(res.data.data)
        setTotalPages(res.data.totalPages)
      } catch (err) {
        console.error("Failed to load history", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [page, statusFilter])

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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="slots">Slots</TabsTrigger>
                  <TabsTrigger value="upcoming">Booked Slots (Upcoming)</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="slots" className="mt-6">
                  <SlotsTab slots={allSlots} />
                </TabsContent>

                <TabsContent value="upcoming" className="mt-6">
                  <UpcomingTab slots={bookedUpcoming} />
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                  <HistoryTab
                    slots={history}
                    currentPage={page}
                    totalPages={totalPages}
                    onFilterChange={setStatusFilter}
                    onPageChange={setPage}
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
