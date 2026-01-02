"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  CreditCard,
  FileText,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { convertTo12Hour, formatDateToDDMMYYYY } from "@/utils/timeConverter";

export interface HistoryRecord {
  _id: string;
  date: string;
  day: string;
  slot: { start: string; end: string };
  status: string;
  note?: string;
  paymentOrderId?: string;
  cancellationReason?: string;
  createdAt: string;
  courseId?: { title: string };
  studentId?: { name: string; email: string };
}

export default function HistoryTab({
  slots,
  onFilterChange,
  onPageChange,
  currentPage,
  totalPages,
}: {
  slots: HistoryRecord[];
  onFilterChange: (status?: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}) {
  const [selected, setSelected] = useState("");

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    setSelected(value || "");
    onFilterChange(value);
    onPageChange(1);
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      case "booked":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-10">
      {/* Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-50 rounded-xl">
            <Filter className="w-4 h-4 text-black" />
          </div>
          <select
            value={selected}
            onChange={handleFilter}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/5"
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
            <option value="booked">Booked</option>
          </select>
        </div>

        {slots.length > 0 && (
          <p className="text-sm font-bold text-zinc-400">
            Total Records: <span className="text-black">{slots.length}</span>
          </p>
        )}
      </div>

      {/* Empty State */}
      {!slots.length ? (
        <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-zinc-200">
          <FileText className="mx-auto mb-4 h-12 w-12 text-zinc-200" />
          <p className="text-xl font-black text-black">No history found</p>
          <p className="text-zinc-400 font-medium">Try changing your filters or check back later.</p>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot) => (
              <Card
                key={slot._id}
                className="group border-0 shadow-sm ring-1 ring-zinc-200 hover:ring-black transition-all duration-300 rounded-[2rem] overflow-hidden bg-white"
              >
                <CardHeader className="p-6 border-b border-zinc-50 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-black text-black leading-tight line-clamp-2">
                      {slot.courseId?.title || "Untitled Course"}
                    </CardTitle>
                    <Badge className={`${statusVariant(slot.status)} text-[10px] font-black uppercase tracking-widest px-3 py-1 shrink-0`}>
                      {slot.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <p className="text-xs font-bold uppercase tracking-tight">
                      {formatDateToDDMMYYYY(slot.date)} • {slot.day}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-5">
                  {/* Time Section */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-50 rounded-lg">
                      <Clock className="h-3.5 w-3.5 text-black" />
                    </div>
                    <span className="text-sm font-bold text-black">
                      {convertTo12Hour(slot.slot.start)} – {convertTo12Hour(slot.slot.end)}
                    </span>
                  </div>

                  {/* Student Section */}
                  {slot.studentId && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-50/50 rounded-2xl border border-zinc-50">
                      <div className="w-8 h-8 bg-white border border-zinc-100 rounded-full flex items-center justify-center font-black text-[10px] text-zinc-400">
                        {slot.studentId.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-black truncate">
                          {slot.studentId.name}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-400 truncate">
                          {slot.studentId.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Payment Section */}
                  {slot.paymentOrderId && (
                    <div className="flex items-center gap-2 text-zinc-400 bg-zinc-50 p-2 rounded-lg">
                      <CreditCard className="h-3 w-3" />
                      <p className="text-[10px] font-mono font-bold truncate">
                        ID: {slot.paymentOrderId}
                      </p>
                    </div>
                  )}

                  {/* Cancel reason */}
                  {slot.status === "cancelled" &&
                    slot.cancellationReason && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50/50 border border-red-100">
                        <XCircle className="h-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-red-600 font-medium leading-relaxed">
                          Reason: {slot.cancellationReason}
                        </p>
                      </div>
                    )}
                </CardContent>

                <div className="px-6 py-4 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 border-t border-zinc-50">
                  Recorded on {new Date(slot.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
