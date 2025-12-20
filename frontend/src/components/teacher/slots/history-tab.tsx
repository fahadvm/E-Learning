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

interface HistoryRecord {
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
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selected}
            onChange={handleFilter}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
            <option value="booked">Booked</option>
          </select>
        </div>

        {slots.length > 0 && (
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold">{slots.length}</span> records
          </p>
        )}
      </div>

      {/* Empty State */}
      {!slots.length ? (
        <Card>
          <CardContent className="p-10 text-center text-gray-500">
            <FileText className="mx-auto mb-3 h-10 w-10 opacity-50" />
            No history found
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot) => (
              <Card
                key={slot._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2 flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-bold text-gray-900">
                      {slot.courseId?.title || "Untitled Course"}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDateToDDMMYYYY(slot.date)} • {slot.day}
                    </p>
                  </div>

                  <Badge className={`${statusVariant(slot.status)} text-xs`}>
                    {slot.status.toUpperCase()}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-3 border-t pt-4 text-sm">
                  {/* Time */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    {convertTo12Hour(slot.slot.start)} –{" "}
                    {convertTo12Hour(slot.slot.end)}
                  </div>

                  {/* Student */}
                  {slot.studentId && (
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-800">
                          {slot.studentId.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {slot.studentId.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Payment */}
                  {slot.paymentOrderId && (
                    <div className="flex items-start gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500 mt-0.5" />
                      <p className="text-xs font-mono truncate">
                        {slot.paymentOrderId}
                      </p>
                    </div>
                  )}

                  {/* Note */}
                  {slot.note && (
                    <div className="border-t pt-2 text-xs text-gray-600 italic">
                      {slot.note}
                    </div>
                  )}

                  {/* Cancel reason */}
                  {slot.status === "cancelled" &&
                    slot.cancellationReason && (
                      <div className="flex items-start gap-2 p-2 rounded-md bg-red-50 border border-red-200">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                        <p className="text-xs text-red-600">
                          {slot.cancellationReason}
                        </p>
                      </div>
                    )}
                </CardContent>

                <div className="px-4 py-2 text-xs text-gray-500 border-t">
                  Created on{" "}
                  {new Date(slot.createdAt).toLocaleString("en-US")}
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
