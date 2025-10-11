"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Clock, CreditCard, AlertCircle, Trash2, Calendar } from "lucide-react"
import { studentBookingApi } from "@/services/APImethods/studentAPImethods"
import { useRouter } from "next/navigation"

// Backend field names
type BookingStatus = "pending" | "approved" | "rejected" | "booked" | "paid"

interface Slot {
  start: string
  end: string
}

interface Course {
  _id: string
  title: string
  subtitle?: string
  description?: string
  totalDuration?: number
}

interface Teacher {
  _id: string
  name: string
  profilePicture?: string
}

export interface BookingRequest {
  id: string
  studentId: string
  teacherId: Teacher
  courseId: Course
  slot: Slot
  date: string
  status: BookingStatus
  rejectionReason?: string
  createdAt: string
}

export function BookingRequestsHistory() {
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)

  const router = useRouter()

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await studentBookingApi.getBookingHistory()
        console.log("response from backend:", res.data)
        setBookings(res.data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-warning/10 text-gray-500 border-warning/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-success/10 text-blue-900 border-success/20">
            Approved
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="bg-success/10 text-green-500 border-success/20">
            <Check className="h-3 w-3 mr-1" />
            Booked
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
    }
  }

  const handlePayment = (booking: BookingRequest) => {
    router.push(`/student/booking/payment?bookingId=${booking.id}&courseId=${booking.courseId._id}`)
  }

  const handleCancel = async (bookingId: string) => {
    const confirm = window.confirm("Are you sure you want to cancel this pending booking?")
    if (!confirm) return

    try {
      setCancelling(bookingId)
      await studentBookingApi.cancelBooking(bookingId)
      setBookings((prev) => prev.filter((b) => b.id !== bookingId))
    } catch (error) {
      console.error("Error cancelling booking:", error)
      alert("Failed to cancel booking. Please try again.")
    } finally {
      setCancelling(null)
    }
  }

  if (loading) return <p className="text-center text-muted-foreground">Loading booking requests...</p>
  if (bookings.length === 0) return <p className="text-center text-muted-foreground">No booking requests found.</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Booking Request History</h2>
          <p className="text-sm text-muted-foreground mt-1">Review and manage all booking requests</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{bookings.length}</span>
          <span>Total Requests</span>
        </div>
      </div>

      {bookings.map((booking) => (
        <Card key={booking.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-12 w-12 border-2 border-border">
                <AvatarImage src={booking.teacherId?.profilePicture || "/placeholder.svg"} alt={booking.teacherId?.name} />
                <AvatarFallback>
                  {booking.teacherId?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{booking.teacherId?.name}</h3>
                  {getStatusBadge(booking.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{booking.courseId?.title}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {booking.date.split("-").reverse().join("-")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {booking.slot.start} - {booking.slot.end}
                  </span>
                  <span>
                    Duration: {Math.floor(
                      (new Date(`1970-01-01T${booking.slot.end}:00Z`).getTime() -
                        new Date(`1970-01-01T${booking.slot.start}:00Z`).getTime()) /
                      60000
                    )} min
                  </span>
                  <span className="text-xs">Requested {new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>

                {booking.status === "rejected" && booking.rejectionReason && (
                  <div className="mt-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-destructive">Rejection Reason</p>
                        <p className="text-sm text-muted-foreground mt-1">{booking.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:flex-col sm:items-stretch">
              {booking.status === "approved" && (
                <Button
                  onClick={() => handlePayment(booking)}
                  className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </Button>
              )}

              {booking.status === "pending" && (
                <Button
                  onClick={() => handleCancel(booking.id)}
                  className="flex-1 sm:flex-none bg-destructive hover:bg-destructive/90"
                  disabled={cancelling === booking.id}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {cancelling === booking.id ? "Cancelling..." : "Cancel"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
