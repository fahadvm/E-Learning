'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
import { Calendar } from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import { CalendarIcon, RotateCw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type TransactionType = 'ALL' | 'COURSE' | 'CALL';

export default function EarningsPage() {
  const { teacher } = useTeacher();

  const [stats, setStats] = useState({ balance: 0, totalEarned: 0, totalWithdrawn: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [typeFilter, setTypeFilter] = useState<TransactionType>('ALL');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const fetchEarnings = useCallback(async () => {
    if (!teacher) return;

    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await teacherEarningsApi.getEarningsStats();
      
      if (statsRes.ok) {
        setStats(statsRes.data);
      }

      // Format dates properly (start of day → end of day)
      const formatDate = (date: Date | undefined) => {
        if (!date) return undefined;
        return format(date, 'yyyy-MM-dd');
      };

      const historyRes = await teacherEarningsApi.getEarningsHistory({
        page,
        limit: 10,
        type: typeFilter === 'ALL' ? undefined : typeFilter, // "COURSE" or "CALL"
        startDate: formatDate(dateRange.from),
        endDate: formatDate(dateRange.to),
      });
      console.log("history",historyRes)

      if (historyRes.ok) {
        setTransactions(historyRes.data.data);
        setTotalPages(historyRes.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    } finally {
      setLoading(false);
    }
  }, [teacher, page, typeFilter, dateRange.from, dateRange.to]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [typeFilter, dateRange]);

  if (!teacher) {
    return <div className="text-center mt-20 text-gray-500">Loading profile...</div>;
  }

  const hasActiveFilters = typeFilter !== 'ALL' || dateRange.from || dateRange.to;

  return (
    <>
      <Header />
      <main className="container mx-auto bg-gray-50 min-h-screen p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Earnings & History</h1>
          <p className="text-gray-500 mt-1">Track your revenue from courses and 1:1 calls</p>
        </div>

        <EarningsStats stats={stats}  />

        <div className="bg-white rounded-2xl shadow-sm border p-6 mt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Transaction History</h2>

            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TransactionType)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Transactions</SelectItem>
                  <SelectItem value="COURSE">Course Sales</SelectItem>
                  <SelectItem value="CALL">1:1 Calls</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-64 justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range: any) => setDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTypeFilter('ALL');
                    setDateRange({ from: undefined, to: undefined });
                  }}
                  className="text-red-600 hover:bg-red-50"
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          <TransactionTable transactions={transactions} loading={loading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3  mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>

              <span className="text-sm font-medium text-gray-600">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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