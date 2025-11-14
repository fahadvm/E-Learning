"use client";

import type { Slot } from "@/app/teacher/slots/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Video, CalendarClock } from "lucide-react";
import { convertTo12Hour } from "@/utils/timeConverter";
import { useEffect, useState } from "react";
import { teacherCallRequestApi } from "@/services/APIservices/teacherApiService";
import { showSuccessToast } from "@/utils/Toast";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UpcomingTab({
  slots,
  currentPage,
  totalPages,
  onPageChange,
}: {
  slots: Slot[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [updatedSlots, setUpdatedSlots] = useState<Slot[]>(slots);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedNewSlot, setSelectedNewSlot] = useState<Slot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    if (isModalOpen) {
      async function fetchAvailableSlots() {
        setIsLoading(true);
        setError(null);
        try {
          const res = await teacherCallRequestApi.getslotsList();
          const available = res.data
            .filter((s: any) => s.status === "available")
            .map((item: any) => ({
              _id: item._id,
              dateKey: item.date,
              day:item.day,
              startISO: item.slot.start,
              endISO: item.slot.end,
              status: item.status,
            }));
            console.log("setAvailableSlots",available)
          setAvailableSlots(available);
        } catch (err) {
          setError("Failed to fetch available slots. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
      fetchAvailableSlots();
    }
  }, [isModalOpen]);

  const handleRescheduleClick = (slotId: string) => {
    console.log("here slectslot id is ", slotId)
    setSelectedSlotId(slotId);
    setIsModalOpen(true);
  };
  const handleVideoCallClick = (slotId: string) => {
    console.log("here slectslot id for video call is ", slotId)
    router.push(`/teacher/videoCall`)
  };

  const handleRescheduleConfirm = async () => {
    console.log("reschedulling is working ")
    console.log("reschedulling is working for res",selectedSlotId,rescheduleReason.trim() , selectedNewSlot)
    if (selectedSlotId && rescheduleReason.trim() && selectedNewSlot) {

      setIsLoading(true);
      try {
            console.log("reschedulling is working for res")

        const res = await teacherCallRequestApi.rescheduleRequests(selectedSlotId, {
          reason: rescheduleReason,
          nextSlot: {
            start: selectedNewSlot.startISO,
            end: selectedNewSlot.endISO,
            date: selectedNewSlot.dateKey,
            day:selectedNewSlot.day,
          },
        });
        if (res.ok) {
          showSuccessToast(`Meeting rescheduled successfully`);
          setUpdatedSlots((prev) => prev.filter((s) => s._id !== selectedSlotId));
          setIsModalOpen(false);
          setRescheduleReason("");
          setSelectedSlotId(null);
          setSelectedNewSlot(null);
        }
      } catch (err) {
        setError("Failed to reschedule. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!updatedSlots.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No upcoming meetings.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {updatedSlots.map((s) => (
          <Card key={s._id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {new Date(s.dateKey).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </CardTitle>
                <CardTitle className="text-md font-medium text-gray-700">
                  {convertTo12Hour(s.startISO)} - {convertTo12Hour(s.endISO)}
                </CardTitle>
              </div>
              {s.status === "booked" && (
                <Badge className="bg-blue-500 text-white text-xs font-semibold">Booked</Badge>
              )}
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4 pt-4 border-t">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-800">
                  {s.student?.name}
                  <span className="text-gray-500 text-xs"> • {s.course?.title}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">{s.student?.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  className="flex items-center gap-1"
                  aria-label="Chat with student"
                  title="Chat with student"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800"
                  onClick={() => handleVideoCallClick(s._id)}
                  aria-label="Join video call"
                  title="Join video call"
                >
                  <Video className="h-4 w-4" />
                </Button>

                {s.status === "booked" && (
                  <Button
                    variant="destructive"
                    className="flex items-center gap-1"
                    onClick={() => handleRescheduleClick(s._id)}
                    aria-label="Reschedule meeting"
                    title="Reschedule meeting"
                  >
                    <CalendarClock className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reschedule Meeting</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select a new time slot and provide a reason for rescheduling.
            </p>
            {isLoading && <p className="text-sm text-gray-500">Loading available slots...</p>}
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <textarea
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              placeholder="Enter reason for rescheduling"
              aria-label="Reason for rescheduling"
            />

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Slots</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableSlots.length ? (
                  availableSlots.map((slot) => (
                    
                    <label
                      key={slot._id}
                      className={`flex items-center p-2 border rounded-lg cursor-pointer ${
                        selectedNewSlot?._id === slot._id ? "border-blue-500 bg-blue-50": "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        checked={selectedNewSlot?._id === slot._id}
                        onChange={() => setSelectedNewSlot(slot)}
                        className="mr-2"
                      />
                      <div>
                        <div className="text-sm font-medium">
                          {new Date(slot.dateKey).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {convertTo12Hour(slot.startISO)} - {convertTo12Hour(slot.endISO)}
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No available slots found.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700"
                onClick={() => {
                  setIsModalOpen(false);
                  setRescheduleReason("");
                  setSelectedSlotId(null);
                  setSelectedNewSlot(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleRescheduleConfirm}
                disabled={!rescheduleReason.trim() || !selectedNewSlot || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Rescheduling..." : "Confirm"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {totalPages && totalPages > 1 && onPageChange && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage! - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage! + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}