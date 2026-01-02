"use client";

import type { Slot } from "@/app/teacher/slots/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Video, CalendarClock, Copy, Check } from "lucide-react";
import { convertTo12Hour } from "@/utils/timeConverter";
import { useEffect, useState } from "react";
import { teacherCallRequestApi } from "@/services/APIservices/teacherApiService";
import { showSuccessToast } from "@/utils/Toast";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCall } from "@/context/CallContext";

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

  // Call ID Modal State
  const [callIdModalOpen, setCallIdModalOpen] = useState(false);
  const [modalCall, setModalCall] = useState<Slot | null>(null);
  const [copied, setCopied] = useState(false);

  const router = useRouter();
  const { startCall } = useCall();

  const initiateVideoCall = (slot: Slot) => {
    if (slot.student && slot.student._id) {
      startCall(slot.student._id, slot.student.name);
    } else {
      showSuccessToast("Student details missing");
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      async function fetchAvailableSlots() {
        setIsLoading(true);
        setError(null);
        try {
          const res = await teacherCallRequestApi.getslotsList();
          const available = res.data
            .filter((s: { status: string; _id: string; date: string; day: string; slot: { start: string; end: string } }) => s.status === "available")
            .map((item: { _id: string; date: string; day: string; slot: { start: string; end: string }; status: string }) => ({
              _id: item._id,
              dateKey: item.date,
              day: item.day,
              startISO: item.slot.start,
              endISO: item.slot.end,
              status: item.status,
            }));
          setAvailableSlots(available);
        } catch (err) {
          console.log(err)
          setError("Failed to fetch available slots. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
      fetchAvailableSlots();
    }
  }, [isModalOpen]);

  const handleRescheduleClick = (slotId: string) => {
    setSelectedSlotId(slotId);
    setIsModalOpen(true);
  };

  const openCallIdModal = (slot: Slot) => {
    setModalCall(slot);
    setCallIdModalOpen(true);
    setCopied(false);
  };

  const handleVideoCallClick = (callId: string) => {
    router.push(`/teacher/videoCall?callid=${callId}`);
  };

  const copyCallId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = id;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRescheduleConfirm = async () => {
    if (selectedSlotId && rescheduleReason.trim() && selectedNewSlot) {
      setIsLoading(true);
      try {
        const res = await teacherCallRequestApi.rescheduleRequests(selectedSlotId, {
          reason: rescheduleReason,
          nextSlot: {
            start: selectedNewSlot.startISO,
            end: selectedNewSlot.endISO,
            date: selectedNewSlot.dateKey,
            day: selectedNewSlot.day,
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
        console.log(err)
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

  // Call ID Modal Component
  const CallIdModal = () => {
    if (!modalCall) return null;

    return (
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setCallIdModalOpen(false)}
      >
        <motion.div
          className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-3">Video Call ID</h2>
          <p className="text-sm text-gray-600 mb-4">
            Share this ID with your student.
          </p>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg font-mono text-sm break-all">
            <span className="flex-1">{modalCall.callId}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyCallId(modalCall.callId)}
              className="h-8 w-8 shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setCallIdModalOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="default"
              className="bg-blue-700 hover:bg-blue-800"
              onClick={() => {
                setCallIdModalOpen(false);
                initiateVideoCall(modalCall);
              }}
            >
              <Video className="h-4 w-4 mr-2" />
              Join Now
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {updatedSlots.map((s) => (
          <Card key={s._id} className="group border-0 shadow-sm ring-1 ring-zinc-200 hover:ring-black transition-all duration-300 rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-6 border-b border-zinc-100 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-zinc-50 rounded-xl">
                  <CalendarClock className="w-5 h-5 text-black" />
                </div>
                {s.status === "booked" && (
                  <Badge className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1">
                    Booked
                  </Badge>
                )}
              </div>
              <div className="mt-2">
                <CardTitle className="text-xl font-black text-black tracking-tight">
                  {new Date(s.dateKey).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </CardTitle>
                <p className="text-sm font-bold text-zinc-500">
                  {convertTo12Hour(s.startISO)} - {convertTo12Hour(s.endISO)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center font-black text-zinc-400">
                  {s.student?.name?.charAt(0) || 'S'}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-black text-black line-clamp-1">
                    {s.student?.name}
                  </div>
                  <div className="text-xs font-bold text-zinc-400 truncate">{s.student?.email}</div>
                  <Badge variant="outline" className="mt-2 text-[10px] font-bold border-zinc-200 text-zinc-500 uppercase">
                    {s.course?.title || 'No Course Selection'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-100">
                <Button
                  variant="outline"
                  className="h-10 rounded-xl border-zinc-200 hover:bg-zinc-50 font-bold"
                  aria-label="Chat with student"
                  title="Chat with student"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>

                <Button
                  className="h-10 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold shadow-lg"
                  onClick={() => initiateVideoCall(s)}
                  aria-label="Start video call"
                  title="Start video call"
                >
                  <Video className="h-4 w-4" />
                </Button>

                {s.status === "booked" && (
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-zinc-200 text-zinc-400 hover:text-black hover:border-black font-bold"
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

      {/* Reschedule Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl border border-zinc-100 overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-zinc-50 rounded-2xl">
                <CalendarClock className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-black tracking-tight">Reschedule</h2>
                <p className="text-zinc-400 font-medium text-xs">Select a new slot and provide a reason.</p>
              </div>
            </div>

            {error && <p className="text-xs font-bold text-red-500 mb-4 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block">Reschedule Reason</label>
                <textarea
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  rows={3}
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Why are we rescheduling this session?"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 block">Available Slots</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {availableSlots.length ? (
                    availableSlots.map((slot) => (
                      <label
                        key={slot._id}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${selectedNewSlot?._id === slot._id
                          ? "border-black bg-black text-white shadow-lg"
                          : "border-zinc-100 bg-zinc-50 hover:bg-zinc-100 text-zinc-600"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="slot"
                            checked={selectedNewSlot?._id === slot._id}
                            onChange={() => setSelectedNewSlot(slot)}
                            className="hidden"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedNewSlot?._id === slot._id ? 'border-white' : 'border-zinc-300'}`}>
                            {selectedNewSlot?._id === slot._id && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div>
                            <p className="text-xs font-black">
                              {new Date(slot.dateKey).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <p className={`text-[10px] font-bold ${selectedNewSlot?._id === slot._id ? 'text-zinc-400' : 'text-zinc-400'}`}>
                              {convertTo12Hour(slot.startISO)} - {convertTo12Hour(slot.endISO)}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="py-8 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                      <p className="text-xs font-bold text-zinc-400 italic">No available slots found.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                variant="ghost"
                className="flex-1 h-12 rounded-xl text-zinc-500 font-bold hover:text-black"
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
                onClick={handleRescheduleConfirm}
                disabled={!rescheduleReason.trim() || !selectedNewSlot || isLoading}
                className="flex-1 h-12 bg-black text-white hover:bg-zinc-800 rounded-xl font-bold shadow-xl"
              >
                {isLoading ? "Wait..." : "Confirm"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Call ID Modal */}
      {callIdModalOpen && <CallIdModal />}

      {/* Pagination */}
      {totalPages && totalPages > 1 && onPageChange && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage! - 1)}
            disabled={currentPage === 1}
            className="rounded-xl border-zinc-200 font-bold h-10"
          >
            Previous
          </Button>
          <div className="mx-4 flex items-center gap-1 font-black text-sm text-black">
            <span>{currentPage}</span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-400">{totalPages}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage! + 1)}
            disabled={currentPage === totalPages}
            className="rounded-xl border-zinc-200 font-bold h-10"
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}