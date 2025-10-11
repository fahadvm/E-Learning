"use client"

import { Calendar, Clock, DollarSign, Mail, User, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BookingRequest } from "./booking-requests-list"

interface BookingRequestCardProps {
  booking: BookingRequest
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function BookingRequestCard({ booking, onApprove, onReject }: BookingRequestCardProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-warning text-warning-foreground",
    },
    approved: {
      label: "Approved",
      className: "bg-success text-success-foreground",
    },
    completed: {
      label: "Completed",
      className: "bg-muted text-muted-foreground",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-destructive text-destructive-foreground",
    },
  }

  const status = statusConfig[booking.status]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="border-b border-border bg-muted/30 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-foreground">{booking.subject}</h3>
              <Badge className={status.className}>{status.label}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{booking.studentName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-accent-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="text-lg font-semibold">{booking.price}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{formatDate(booking.requestedDate)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">
              {booking.requestedTime} ({booking.duration} min)
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm sm:col-span-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{booking.studentEmail}</span>
          </div>
        </div>

        {booking.message && (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm leading-relaxed text-foreground">{booking.message}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-border bg-muted/20 pt-4">
        {booking.status === "pending" && (
          <div className="flex w-full gap-3">
            <Button onClick={() => onReject(booking.id)} variant="outline" className="flex-1">
              Decline
            </Button>
            <Button
              onClick={() => onApprove(booking.id)}
              className="flex-1 bg-success text-success-foreground hover:bg-success/90"
            >
              Approve Request
            </Button>
          </div>
        )}

        {booking.status === "approved" && (
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Video className="mr-2 h-4 w-4" />
              Join Call
            </Button>
            <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
              <DollarSign className="mr-2 h-4 w-4" />
              Proceed to Payment
            </Button>
          </div>
        )}

        {booking.status === "cancelled" && (
          <p className="w-full text-center text-sm text-muted-foreground">This request has been declined</p>
        )}

        {booking.status === "completed" && (
          <p className="w-full text-center text-sm text-muted-foreground">Session completed</p>
        )}
      </CardFooter>
    </Card>
  )
}
