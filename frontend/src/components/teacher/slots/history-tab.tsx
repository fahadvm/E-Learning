import { convertTo12Hour, formatDateToDDMMYYYY } from "@/utils/timeConverter";
import { useState } from "react";
import { Calendar, Clock, User, CreditCard, FileText, XCircle, Filter, ChevronLeft, ChevronRight } from "lucide-react";

interface HistoryRecord {
  _id: string;
  date: string;
  day: string;
  slot: {
    start: string;
    end: string;
  };
  status: string;
  note?: string;
  paymentOrderId?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  courseId?: { _id: string; title: string };
  studentId?: { _id: string; name: string; email: string };
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
  const [selected, setSelected] = useState<string>("");

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    setSelected(value || "");
    onFilterChange(value);
    onPageChange(1);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "booked":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-600" />
          <select
            value={selected}
            onChange={handleFilter}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
            <option value="booked">Booked</option>
          </select>
        </div>

        {slots.length > 0 && (
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{slots.length}</span> records
          </p>
        )}
      </div>

      {!slots.length ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No records found</h3>
          <p className="text-sm text-slate-500">Try adjusting your filters to see more results</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className="group bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 flex-1 pr-2">
                      {slot.courseId?.title || "Untitled Course"}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyles(
                        slot.status
                      )} whitespace-nowrap`}
                    >
                      {slot.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>
                        {formatDateToDDMMYYYY(slot.date)}{" "}
                        <span className="text-slate-400">•</span>{" "}
                        <span className="font-medium">{slot.day}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>
                        {convertTo12Hour(slot.slot.start)} - {convertTo12Hour(slot.slot.end)}
                      </span>
                    </div>

                    {slot.studentId && (
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <User className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-700 truncate">{slot.studentId.name}</p>
                          <p className="text-xs text-slate-500 truncate">{slot.studentId.email}</p>
                        </div>
                      </div>
                    )}

                    {slot.paymentOrderId && (
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500">Payment ID</p>
                          <p className="font-mono text-xs text-slate-700 truncate">
                            {slot.paymentOrderId}
                          </p>
                        </div>
                      </div>
                    )}

                    {slot.note && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs font-medium text-slate-500 mb-1">Note</p>
                        <p className="text-sm text-slate-600 italic line-clamp-2">{slot.note}</p>
                      </div>
                    )}

                    {slot.status === "cancelled" && slot.cancellationReason && (
                      <div className="flex items-start gap-2 p-3 bg-rose-50 rounded-lg border border-rose-100">
                        <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-rose-700 mb-0.5">Cancellation Reason</p>
                          <p className="text-sm text-rose-600 line-clamp-2">
                            {slot.cancellationReason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Created {new Date(slot.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  Page <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
                  <span className="font-semibold text-slate-900">{totalPages}</span>
                </span>
              </div>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
