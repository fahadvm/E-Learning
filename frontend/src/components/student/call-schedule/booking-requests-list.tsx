"use client"

import { useState } from "react"
import { BookingRequestCard } from "./booking-request-card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type BookingStatus = "pending" | "approved" | "completed" | "cancelled"

export interface BookingRequest {
  id: string
  studentName: string
  studentEmail: string
  subject: string
  requestedDate: string
  requestedTime: string
  duration: number
  status: BookingStatus
  message?: string
  price: number
}

// Mock data - replace with actual data fetching
const mockBookings: BookingRequest[] = [
  {
    id: "1",
    studentName: "Sarah Johnson",
    studentEmail: "sarah.j@example.com",
    subject: "Mathematics Tutoring",
    requestedDate: "2025-10-15",
    requestedTime: "14:00",
    duration: 60,
    status: "pending",
    message: "Need help with calculus derivatives and integration",
    price: 50,
  },
  {
    id: "2",
    studentName: "Michael Chen",
    studentEmail: "michael.c@example.com",
    subject: "Physics Consultation",
    requestedDate: "2025-10-16",
    requestedTime: "10:00",
    duration: 45,
    status: "pending",
    message: "Questions about quantum mechanics",
    price: 45,
  },
  {
    id: "3",
    studentName: "Emily Rodriguez",
    studentEmail: "emily.r@example.com",
    subject: "Chemistry Lab Review",
    requestedDate: "2025-10-14",
    requestedTime: "16:30",
    duration: 60,
    status: "approved",
    message: "Review organic chemistry lab results",
    price: 50,
  },
  {
    id: "4",
    studentName: "David Kim",
    studentEmail: "david.k@example.com",
    subject: "Programming Help",
    requestedDate: "2025-10-17",
    requestedTime: "11:00",
    duration: 90,
    status: "pending",
    message: "Need assistance with React and Next.js project",
    price: 75,
  },
]

export function BookingRequestsList() {
  const [bookings, setBookings] = useState<BookingRequest[]>(mockBookings)
  const [activeTab, setActiveTab] = useState("all")

  const handleApprove = (id: string) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === id ? { ...booking, status: "approved" as BookingStatus } : booking)),
    )
  }

  const handleReject = (id: string) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === id ? { ...booking, status: "cancelled" as BookingStatus } : booking)),
    )
  }

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return booking.status === "pending"
    if (activeTab === "approved") return booking.status === "approved"
    return true
  })

  const pendingCount = bookings.filter((b) => b.status === "pending").length
  const approvedCount = bookings.filter((b) => b.status === "approved").length

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all" className="relative">
            All
            <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
              {bookings.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingCount > 0 && (
              <Badge variant="default" className="ml-2 h-5 min-w-5 bg-warning px-1.5 text-xs text-warning-foreground">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="relative">
            Approved
            {approvedCount > 0 && (
              <Badge variant="default" className="ml-2 h-5 min-w-5 bg-success px-1.5 text-xs text-success-foreground">
                {approvedCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No booking requests found</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <BookingRequestCard
                key={booking.id}
                booking={booking}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
 