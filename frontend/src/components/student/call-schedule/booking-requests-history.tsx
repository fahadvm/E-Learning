"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Check,
  X,
  Clock,
  AlertCircle,
  Trash2,
  Calendar,
  History

} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { studentBookingApi } from "@/services/APIservices/studentApiservice";
import { useRouter } from "next/navigation";
import { convertTo12Hour } from "@/utils/timeConverter";
import Link from "next/link";

type BookingStatus = "pending" | "rescheduled" | "failed" | "booked"  | "cancelled";

interface Slot {
  start: string;
  end: string;
}

interface Course {
  _id: string;
  title: string;
}

interface Teacher {
  _id: string;
  name: string;
  profilePicture?: string;
}

export interface BookingRequest {
  _id: string;
  studentId: string;
  teacherId: Teacher;
  courseId: Course;
  slot: Slot;
  date: string;
  status: BookingStatus;
  rejectionReason?: string;
  rescheduledReason?: string;
  createdAt: string;
}

export function BookingRequestsHistory() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(
    null
  );
  const [cancelReason, setCancelReason] = useState("");
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const router = useRouter();

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await studentBookingApi.getBookingHistory({
          page,
          limit: 10,
          status: statusFilter === "all" ? undefined : statusFilter,
        });

        const data = Array.isArray(res.data.data) ? res.data.data : res.data;
        setBookings(data);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page, statusFilter]);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-warning/10 text-gray-500 border-warning/20"
          >
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      
      case "booked":
        return (
          <Badge
            variant="outline"
            className="bg-success/10 text-green-500 border-success/20"
          >
            <Check className="h-3 w-3 mr-1" /> Booked
          </Badge>
        );
      case "rescheduled":
        return (
          <Badge
            variant="outline"
            className="bg-destructive/10 text-destructive border-destructive/20"
          >
            <X className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-destructive/10 text-destructive border-destructive/20"
          >
            <X className="h-3 w-3 mr-1" /> cancelled
          </Badge>
        );
    }
  };

  const handlePayment = (booking: BookingRequest) => {
    console.log("bookingid", booking._id)
    router.push(
      `/student/booking/payment?bookingId=${booking._id}&courseId=${booking.courseId._id}`
    );
  };

  const handleCancelConfirm = (booking: BookingRequest) => {
    setSelectedBooking(booking);
    setCancelReason("");
    setConfirmCancelOpen(true);
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }

    try {
      setCancelling(true);
      console.log("selectedBooking")
      await studentBookingApi.cancelBooking(selectedBooking._id, {
        reason: cancelReason,
      });
      setBookings((prev) =>
        prev.filter((b) => b._id !== selectedBooking._id)
      );
      setConfirmCancelOpen(false);
      setCancelReason("");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Booking Request History
          </h2>
          <p className="text-sm text-muted-foreground">
            Review and manage all booking requests
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-muted-foreground">
          Loading booking requests...
        </p>
      ) : bookings.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                No Booking History
              </h3>
              <p className="text-sm text-muted-foreground">
                All bookings history will appear here
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {bookings.map((booking) => (
            <Card
              key={booking._id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarImage
                      src={
                        booking.teacherId?.profilePicture || "/placeholder.svg"
                      }
                      alt={booking.teacherId?.name}
                    />
                    <AvatarFallback>
                      {booking.teacherId?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/student/teacher/${booking.teacherId?._id}`} 
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {booking.teacherId?.name}
                      </Link>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {booking.courseId?.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {booking.date.split("-").reverse().join("-")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {convertTo12Hour(booking.slot.start)} -{" "}
                        {convertTo12Hour(booking.slot.end)}
                      </span>
                    </div>

                    {booking.status === "rescheduled" &&
                      booking.rescheduledReason && (
                        <div className="mt-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-destructive">
                                Rejection Reason
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {booking.rejectionReason}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    {booking.status === "cancelled" &&
                      booking.rescheduledReason && (
                        <div className="mt-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-destructive">
                                Rescheduled Reason
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {booking.rescheduledReason}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:flex-col sm:items-stretch">
                  {booking.status === "booked" && (
                    <Button
                      onClick={() => handleCancelConfirm(booking)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Cancel Dialog */}
      <AlertDialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for cancellation. <br />
              <strong className="text-red-500">
                This action cannot be undone.
              </strong>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4 space-y-2">
            <label
              htmlFor="cancelReason"
              className="text-sm font-medium text-foreground"
            >
              Reason
            </label>
            <textarea
              id="cancelReason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Write your reason here..."
              className="w-full border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={!cancelReason.trim() || cancelling}
              onClick={handleCancel}
            >
              {cancelling ? "Cancelling..." : "Confirm Cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
