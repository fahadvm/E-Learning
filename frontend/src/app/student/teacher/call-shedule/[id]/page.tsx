"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  MessageSquare,
  Check,
} from "lucide-react";
import Header from "@/components/student/header";
import { studentBookingApi } from "@/services/APImethods/studentAPImethods";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showSuccessToast } from "@/utils/Toast";

interface Slot {
  start: string; // e.g., "14:30"
  end: string;
}

interface DayAvailability {
  date: string; // "YYYY-MM-DD"
  day: string; // "Monday"
  slots: Slot[];
}

interface SelectedSlot {
  date: string;
  day: string;
  start: string;
  end: string;
}

// Convert 24-hour to 12-hour format
function formatTime12Hour(time24: string) {
  const [hourStr, min] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${min} ${ampm}`;
}

// Convert time string "HH:MM" to minutes
function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export default function StudentTeacherSlotPage() {
  const params = useParams();
  const teacherId = params?.id as string;
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [daysOfWeek, setDaysOfWeek] = useState<DayAvailability[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTime, setFilterTime] = useState("all");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const timezone = "IST"; // optional: dynamic detection

  // Fetch slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await studentBookingApi.getAvailableSlots(teacherId);

        const grouped: DayAvailability[] = res.data.reduce(
          (acc: DayAvailability[], curr: any) => {
            const existing = acc.find((d) => d.date === curr.date);
            if (existing) {
              existing.slots.push({ start: curr.start, end: curr.end });
            } else {
              acc.push({
                date: curr.date,
                day: curr.day,
                slots: [{ start: curr.start, end: curr.end }],
              });
            }
            return acc;
          },
          []
        );

        setDaysOfWeek(grouped);
      } catch (err: any) {
        setError(err.message || "Error fetching slots");
      }
    };

    fetchSlots();
  }, [teacherId]);

  // Filtered slots based on search & time
  const filteredDays = useMemo(() => {
    return daysOfWeek.filter((day) => {
      const matchesSearch =
        day.day.toLowerCase().includes(searchQuery.toLowerCase()) ||
        day.date.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterTime === "all") return true;

      return day.slots.some((slot) => {
        const minutes = timeToMinutes(slot.start);
        switch (filterTime) {
          case "late-night": // 12 AM - 5 AM
            return minutes >= 0 && minutes < 300;
          case "early-morning": // 5 AM - 9 AM
            return minutes >= 300 && minutes < 540;
          case "morning": // 9 AM - 12 PM
            return minutes >= 540 && minutes < 720;
          case "afternoon": // 12 PM - 5 PM
            return minutes >= 720 && minutes < 1020;
          case "evening": // 5 PM - 8 PM
            return minutes >= 1020 && minutes < 1200;
          case "night": // 8 PM - 12 AM
            return minutes >= 1200 && minutes < 1440;
          default:
            return true;
        }
      });
    });
  }, [daysOfWeek, searchQuery, filterTime]);

  // Slot click
  const handleSlotClick = (day: string, date: string, slot: Slot) => {
    setSelectedSlot({ day, date, start: slot.start, end: slot.end });
    setIsModalOpen(true);
    setIsConfirmed(false);
  };

  // Booking
  const handleBook = async () => {
    try {
      if (!selectedSlot || !courseId) return;

      const bookingPayload = {
        teacherId,
        courseId,
        date: selectedSlot.date,
        day: selectedSlot.day,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        note,
      };

      const res = await studentBookingApi.slotBooking(bookingPayload);
      if (res.ok){
        showSuccessToast("Booking requested successfully")
        setIsModalOpen(false);
        setSelectedSlot(null);
        setNote("");
        setIsConfirmed(false);
      }


        
    } catch (err: any) {
      setError(err.message || "Booking failed");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    setNote("");
  };

  const availableCount = filteredDays.reduce(
    (acc, day) => acc + day.slots.length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="font-serif text-4xl font-bold tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Book Your Session
              </h1>
              <p className="mt-2 text-muted-foreground">
                Choose a time that works best for you
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-8 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by day or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select value={filterTime} onValueChange={setFilterTime}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All times</SelectItem>
                    <SelectItem value="late-night">Late Night (12 AM - 5 AM)</SelectItem>
                    <SelectItem value="early-morning">Early Morning (5 AM - 9 AM)</SelectItem>
                    <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                    <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                    <SelectItem value="night">Night (8 PM - 12 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="secondary" className="text-sm">
                {availableCount} slots available
              </Badge>
            </div>
          </div>
        </Card>

        {/* Calendar Grid */}
        {filteredDays.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              No available slots found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your filters
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDays.map((day) => (
              <Card key={day.date} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="border-b bg-muted/30 p-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
                      {day.day}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{day.date}</p>
                  </div>
                  <Badge variant="default">{day.slots.length}</Badge>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  {day.slots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSlotClick(day.day, day.date, slot)}
                      className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-all border-border bg-card hover:border-primary hover:bg-primary/5 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime12Hour(slot.start)} - {formatTime12Hour(slot.end)}
                        </span>
                      </div>
                      <span className="text-xs text-primary">Available</span>
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          {!isConfirmed ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
                  Confirm Your Booking
                </DialogTitle>
                <DialogDescription>Add a note if needed and confirm your booking</DialogDescription>
              </DialogHeader>

              {selectedSlot && (
                <div className="space-y-6">
                  <Card className="bg-muted/30 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">{selectedSlot.day}, {selectedSlot.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{formatTime12Hour(selectedSlot.start)} - {formatTime12Hour(selectedSlot.end)} {timezone}</span>
                    </div>
                  </Card>

                  <div className="space-y-2">
                    <Label htmlFor="note" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="note"
                      rows={3}
                      placeholder="E.g., Please prepare exercises for topic XYZ"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">Cancel</Button>
                    <Button onClick={handleBook} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Confirm Booking</Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-serif text-2xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
                Booking Confirmed!
              </h3>
              <p className="text-muted-foreground">Your booking has been successfully confirmed</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
