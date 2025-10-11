"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Clock, CalendarIcon } from "lucide-react";
import { studentBookingApi } from "@/services/APImethods/studentAPImethods";
import { Skeleton } from "@/components/ui/skeleton";

interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string; // base64 string
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
}

export function ScheduledCalls() {
  const [scheduledCalls, setScheduledCalls] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheduledCalls = async () => {
      try {
        setLoading(true);
        const res = await studentBookingApi.getScheduledCalls();
        if (res.ok && res.data) {
          setScheduledCalls(res.data);
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
    fetchScheduledCalls();
  }, []);

  const handleJoinCall = (meetingLink?: string) => {
    if (!meetingLink) return;
    window.open(meetingLink, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Scheduled Video Calls
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your upcoming paid and confirmed sessions
          </p>
        </div>
        {!loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{scheduledCalls.length}</span>
            <span>Upcoming Calls</span>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
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
        <div className="grid gap-4">
          {scheduledCalls.map((call) => (
            <Card key={call.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-12 w-12 border-2 border-border">
                    {call.teacherId.profilePicture ? (
                      <AvatarImage src={call.teacherId.profilePicture} alt={call.teacherId.name} />
                    ) : (
                      <AvatarFallback>
                        {call.teacherId.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{call.teacherId.name}</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        {call.status === "paid" ? "Paid" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{call.courseId.title}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {call.date.split("-").reverse().join("-")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {call.slot.start} - {call.slot.end}
                      </span>
                      <span>Duration: 30 min</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Booking created at {new Date(call.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleJoinCall(call.meetingLink)}
                  className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 min-w-[140px]"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
