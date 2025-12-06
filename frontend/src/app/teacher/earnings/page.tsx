'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/teacher/header';
import { useTeacher } from '@/context/teacherContext';
import { teacherEarningsApi } from '@/services/APIservices/teacherApiService';
import EarningsStats from '@/components/teacher/earnings/EarningsStats';
import TransactionTable from '@/components/teacher/earnings/TransactionTable';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'; // Verify if available, otherwise use input type date
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // Verify existing utils path

// Fallback for missing Calendar component: usage of native input date
// Using native date inputs for simplicity and reliability if shadcn calendar is not fully setup or complex to import without verification.

export default function EarningsPage() {
    const { teacher } = useTeacher();
    const [stats, setStats] = useState({ balance: 0, totalEarned: 0, totalWithdrawn: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchEarnings = async () => {
        setLoading(true);
        try {
            const statsRes = await teacherEarningsApi.getEarningsStats();
            if (statsRes.success) {
                setStats(statsRes.data);
            }

            const historyRes = await teacherEarningsApi.getEarningsHistory({
                page,
                limit: 10,
                type: typeFilter !== 'ALL' ? typeFilter : undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            });

            if (historyRes.success) {
                setTransactions(historyRes.data.data);
                setTotalPages(historyRes.data.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch earnings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (teacher) {
            fetchEarnings();
        }
    }, [teacher, page, typeFilter, startDate, endDate]);

    if (!teacher) {
        return <div className="text-center mt-10 text-gray-500">Loading profile...</div>;
    }

    return (
        <>
            <Header />
            <main className="container mx-auto bg-gray-50 min-h-screen p-6 md:p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Earnings & History</h1>
                        <p className="text-gray-500">Track your revenue and wallet statement</p>
                    </div>
                    {/* Potential Withdraw Button could go here */}
                </div>

                <EarningsStats stats={stats} />

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>

                        <div className="flex flex-wrap gap-3">
                            {/* Type Filter */}
                            <div className="w-[180px]">
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Transactions</SelectItem>
                                        <SelectItem value="COURSE">Course Sales</SelectItem>
                                        <SelectItem value="CALL">Video Calls</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date Filters - Using Native Inputs for reliability */}
                            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white">
                                <span className="text-xs text-gray-500">From</span>
                                <input
                                    type="date"
                                    className="text-sm outline-none"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white">
                                <span className="text-xs text-gray-500">To</span>
                                <input
                                    type="date"
                                    className="text-sm outline-none"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                            {(typeFilter !== 'ALL' || startDate || endDate) && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setTypeFilter('ALL');
                                        setStartDate('');
                                        setEndDate('');
                                        setPage(1);
                                    }}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    <TransactionTable transactions={transactions} loading={loading} />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                            >
                                Previous
                            </Button>
                            <div className="flex items-center px-4 text-sm font-medium">
                                Page {page} of {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || loading}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
