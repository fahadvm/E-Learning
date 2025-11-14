"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Video,
  Clock,
  CalendarIcon,
  MoreVertical,
  MessageSquare,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
import { Skeleton } from "@/components/ui/skeleton";
import { convertTo12Hour } from "@/utils/timeConverter";
import { studentBookingApi } from "@/services/APIservices/studentApiservice";
import { showInfoToast, showSuccessToast } from "@/utils/Toast";
import { useRouter } from "next/navigation";

interface Booking {
  _id: string;
  studentId: string;
  studentName: string;
  teacherId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  courseId: {
    _id: string;
    title: string;
  };
  slot: { start: string; end: string };
  date: string;
  status: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
  rescheduleStatus: 'none' | 'requested' | 'approved' | 'rejected';
  requestedDate?: string;
  requestedSlot?: {
    start: string;
    end: string;
  };

  callId: string;
}

export function ScheduledCalls() {
  const [scheduledCalls, setScheduledCalls] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCall, setSelectedCall] = useState<Booking | null>(null);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const router = useRouter()

  const fetchScheduledCalls = async () => {
    try {
      setLoading(true);
      const res = await studentBookingApi.getScheduledCalls({
        page,
        limit: 5,
      });

      if (res.ok && res.data) {
        console.log("setScheduledCalls", res.data)
        setScheduledCalls(res.data);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setScheduledCalls([]);
      }
    } catch (err) {
      console.error("Error fetching scheduled calls:", err);
      setScheduledCalls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledCalls();
  }, [page]);

  const handleJoinCall = (call: Booking) => {
    const { date, slot } = call;
    console.log("call ", call)

    // Current time
    const now = new Date();

    // Combine date + start time → convert to Date()
    const sessionStart = new Date(`${date}T${slot.start}:00`);
    const sessionEnd = new Date(`${date}T${slot.end}:00`);

    // Allow join window: 5 min before start and until end time
    const joinOpen = new Date(sessionStart.getTime() - 5 * 60 * 1000);
    console.log("call ", call)
    if (now <= sessionEnd) {
      router.push(`/student/videoCall?callId=${call.callId}`);
    } else {
      showInfoToast(
        `You can join at ${convertTo12Hour(slot.start)} on ${date.split("-").reverse().join("-")}`
      );
    };
  }

  const handleApproveReschedule = async (bookingId: string) => {
    try {
      const res = await studentBookingApi.approveBooking(bookingId);

      if (res.ok) {
        showSuccessToast("Reschedule approved successfully!");
        fetchScheduledCalls(); // refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectReschedule = async (bookingId: string) => {
    try {
      const res = await studentBookingApi.rejectReschedule(bookingId);

      if (res.ok) {
        showSuccessToast("Reschedule request rejected.");
        fetchScheduledCalls(); // refresh
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleCancelCall = async (callId: string, reason: string) => {
    try {
      const res = await studentBookingApi.cancelBooking(callId, { reason });

      if (res.ok) {
        setScheduledCalls((prev) => prev.filter((b) => b._id !== callId));
        showSuccessToast(res.message);
      }
    } catch (err) {
      console.error("Error cancelling session:", err);
      alert("Failed to cancel session.");
    } finally {
      setConfirmCancelOpen(false);
      setSelectedCall(null);
      setCancelReason("");
    }
  };

  const handleChat = (teacherId: string) => {
    router.push(`/student/chat/${teacherId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Scheduled Video Calls
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your upcoming paid and confirmed sessions
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : scheduledCalls.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                No Scheduled Calls
              </h3>
              <p className="text-sm text-muted-foreground">
                Approved and paid bookings will appear here
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {scheduledCalls.map((call) => (
              <Card
                key={call._id}
                className="p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12 border-2 border-border">
                      {call.teacherId.profilePicture ? (
                        <AvatarImage
                          src={call.teacherId.profilePicture}
                          alt={call.teacherId.name}
                        />
                      ) : (
                        <AvatarFallback>
                          {call.teacherId?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            onClick={() =>
                              (window.location.href = `/student/teacher/${call.teacherId._id}`)
                            }
                            className="font-semibold text-foreground cursor-pointer hover:underline"
                          >
                            {call.teacherId.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-600 border-green-200"
                          >
                            {call.status === "paid"
                              ? "Paid"
                              : call.status === "cancelled"
                                ? "Cancelled"
                                : "Booked"}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {call.courseId.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {call.date.split("-").reverse().join("-")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {convertTo12Hour(call.slot.start)} -{" "}
                          {convertTo12Hour(call.slot.end)}
                        </span>
                        <span>Duration: 30 min</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Booked on {new Date(call.createdAt).toLocaleString()}
                      </p>
                    </div>

                  </div>

                  <div className="gap-5 flex items-center">
                    {call.rescheduleStatus === "requested" ? (
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-md mt-3">
                        <p className="text-sm text-yellow-700 font-medium">
                          Teacher requested to reschedule your session.
                        </p>

                        <p className="text-sm mt-1">
                          New Slot:
                          <strong>
                            {convertTo12Hour(call.requestedSlot?.start || "")} -{" "}
                            {convertTo12Hour(call.requestedSlot?.end || "")}
                          </strong>{" "}
                          on{" "}
                          <strong>{call.requestedDate?.split("-").reverse().join("-")}</strong>
                        </p>

                        <div className= "flex justify-between items-center mt-3">
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApproveReschedule(call._id)}
                          >
                            Approve
                          </Button>

                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleRejectReschedule(call._id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ):(
                    <Button
                      onClick={() => handleJoinCall(call)}
                      className="bg-primary hover:bg-primary/90 min-w-[140px]"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join
                    </Button>
                    )}

                    <DropdownMenu
                      open={dropdownOpen === call._id}
                      onOpenChange={(open) =>
                        setDropdownOpen(open ? call._id : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setDropdownOpen(null);
                            handleChat(call.teacherId._id);
                          }}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" /> Chat
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setDropdownOpen(null);
                            // Delay opening dialog until dropdown fully closes
                            setTimeout(() => {
                              setSelectedCall(call);
                              setCancelReason("");
                              setConfirmCancelOpen(true);
                            }, 50);
                          }}
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>

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

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this session? <br />
              <strong className="text-red-500">
                Refund is not available after cancellation.
              </strong>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4 space-y-2">
            <label htmlFor="cancelReason" className="text-sm font-medium">
              Reason for cancellation
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
              disabled={!cancelReason.trim()}
              onClick={() =>
                selectedCall &&
                handleCancelCall(selectedCall._id, cancelReason)
              }
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
