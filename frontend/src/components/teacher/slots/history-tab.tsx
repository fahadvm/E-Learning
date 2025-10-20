"use client"

import { convertTo12Hour, formatDateToDDMMYYYY } from "@/utils/timeConverter"
import { useState } from "react"

interface HistoryRecord {
    _id: string
    date: string
    day: string
    slot: {
        start: string
        end: string
    }
    status: string
    note?: string
    paymentOrderId?: string
    cancellationReason?: string
    createdAt: string
    updatedAt: string
    courseId?: { _id: string; title: string }
    studentId?: { _id: string; name: string; email: string }
}

export default function HistoryTab({
    slots,
    onFilterChange,
    onPageChange,
    currentPage,
    totalPages,
}: {
    slots: HistoryRecord[]
    onFilterChange: (status?: string) => void
    onPageChange: (page: number) => void
    currentPage: number
    totalPages: number
}) {
    const [selected, setSelected] = useState<string>("")

    const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value || undefined
        setSelected(value || "")
        onFilterChange(value)
        onPageChange(1)
    }

    if (!slots.length)
        return (
            <div className="space-y-6">
                {/* Filter Dropdown */}
                <div className="flex items-center justify-between mb-4">
                    <select
                        value={selected}
                        onChange={handleFilter}
                        className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="booked">Booked</option>
                    </select>
                </div>
                <p className="text-center text-muted-foreground py-6">
                    No history records found.
                </p>
            </div>
        )

    return (
        <div className="space-y-6">
            {/* Filter Dropdown */}
            <div className="flex items-center justify-between mb-4">
                <select
                    value={selected}
                    onChange={handleFilter}
                    className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="booked">Booked</option>
                </select>
            </div>

            {/* History Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {slots.map((slot) => (
                    <div
                        key={slot._id}
                        className="border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-all bg-white"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {slot.courseId?.title || "No Course Title"}
                            </h3>
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${slot.status === "paid"
                                        ? "bg-green-100 text-green-700"
                                        : slot.status === "cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {slot.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                            <p>
                                <strong>Date:</strong> {formatDateToDDMMYYYY(slot.date)} ({slot.day})
                            </p>
                            <p>
                                <strong>Time:</strong> {convertTo12Hour(slot.slot.start)} - {convertTo12Hour(slot.slot.end)}
                            </p>
                            {slot.studentId && (
                                <p>
                                    <strong>Student:</strong> {slot.studentId.name} (
                                    {slot.studentId.email})
                                </p>
                            )}
                            {slot.paymentOrderId && (
                                <p>
                                    <strong>Paryment Order ID:</strong> {slot.paymentOrderId}
                                </p>
                            )}
                            {slot.note && (
                                <p className="italic text-gray-500">
                                    <strong>Note:</strong> {slot.note}
                                </p>
                            )}
                            {slot.status === "cancelled" && (
                                <p className="italic text-gray-500">
                                    <strong>cancelled Reason:</strong> {slot.cancellationReason}
                                </p>
                            )}
                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                            Created: {new Date(slot.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
                >
                    Prev
                </button>
                <span className="text-sm text-gray-700">
                    Page {currentPage} / {totalPages}
                </span>
                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
