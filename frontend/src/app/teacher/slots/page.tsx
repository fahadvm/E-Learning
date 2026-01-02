"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SlotsTab from "@/components/teacher/slots/slots-tab"
import UpcomingTab from "@/components/teacher/slots/upcoming-tab"
import HistoryTab, { HistoryRecord } from "@/components/teacher/slots/history-tab"
import Header from "@/components/teacher/header"
import { teacherCallRequestApi } from "@/services/APIservices/teacherApiService"

type SlotStatus = "booked" | "cancelled" | "rescheduled" | "available"

export type Student = {
  _id: string
  name: string
  email: string
}

export type Course = {
  title: string
}

export type Slot = {
  _id: string
  dateKey: string
  day: string
  startISO: string
  endISO: string
  status: SlotStatus
  student?: Student
  callId: string
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
  callId: string
  _id: string
}

export default function Page() {
  const [allSlots, setAllSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(9)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [upcomingLimit] = useState(6)

  // Fetch available + upcoming slots
  useEffect(() => {
    async function fetchAllSlots() {
      try {
        const res = await teacherCallRequestApi.getslotsList()
        console.log("Slots response:", res.data)

        const transformedSlots: Slot[] = res.data.map((item: BackendSlot) => {
          const { date, slot, day, status, student, course, _id, callId } = item
          console.log("item", item)
          return {
            _id: _id,
            dateKey: date,
            startISO: slot.start,
            endISO: slot.end,
            day: day,
            status,
            student,
            course,
            callId

          }
        })

        setAllSlots(transformedSlots)
        console.log("setAllSlots:", transformedSlots)

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
        const res = await teacherCallRequestApi.getRequestHistory({ page, limit, status: statusFilter })
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



  const bookedUpcoming = allSlots.filter((s) => s.status === "booked")
  const paginatedUpcoming = bookedUpcoming.slice((upcomingPage - 1) * upcomingLimit, upcomingPage * upcomingLimit)
  const upcomingTotalPages = Math.ceil(bookedUpcoming.length / upcomingLimit)



  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fafafa] pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-black tracking-tight">
                Video Meet Slots
              </h1>
              <p className="text-zinc-500 font-medium">
                Manage your availability and view your upcoming professional meetings.
              </p>
            </div>
          </header>

          <Card className="border-0 shadow-sm ring-1 ring-zinc-200 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b border-zinc-50 pb-6">
              <CardTitle className="text-xl font-black text-black">Schedule Overview</CardTitle>
            </CardHeader>

            <CardContent className="pt-8">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
              ) : (
                <Tabs defaultValue="slots" className="w-full">
                  <div className="flex justify-center mb-8">
                    <TabsList className="bg-zinc-100 p-1 rounded-2xl h-14 w-full max-w-md">
                      <TabsTrigger value="slots" className="rounded-xl font-bold data-[state=active]:bg-black data-[state=active]:text-white">Slots</TabsTrigger>
                      <TabsTrigger value="upcoming" className="rounded-xl font-bold data-[state=active]:bg-black data-[state=active]:text-white">Booked</TabsTrigger>
                      <TabsTrigger value="history" className="rounded-xl font-bold data-[state=active]:bg-black data-[state=active]:text-white">History</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="slots" className="mt-0 outline-none">
                    <SlotsTab slots={allSlots} />
                  </TabsContent>

                  <TabsContent value="upcoming" className="mt-0 outline-none">
                    <UpcomingTab
                      slots={paginatedUpcoming}
                      currentPage={upcomingPage}
                      totalPages={upcomingTotalPages}
                      onPageChange={setUpcomingPage}
                    />
                  </TabsContent>

                  <TabsContent value="history" className="mt-0 outline-none">
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
        </div>
      </main>
    </>
  )
}
