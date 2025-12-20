'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/teacher/header';
import { useTeacher } from '@/context/teacherContext';

import { teacherEarningsApi, teacherPayoutApi } from '@/services/APIservices/teacherApiService';

import EarningsStats from '@/components/teacher/earnings/EarningsStats';
import TransactionTable from '@/components/teacher/earnings/TransactionTable';
import RequestPayoutDialog from '@/components/teacher/wallet/RequestPayoutDialog';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';

import {
    CalendarIcon,
    RotateCw,
    Wallet,
} from 'lucide-react';

import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { PayoutStatus, IPayout, WalletStats } from '@/types/payout';

type TransactionType = 'ALL' | 'COURSE' | 'CALL';

export default function TeacherWalletPage() {
    const { teacher } = useTeacher();

    /* ======================= COMMON ======================= */
    const [activeTab, setActiveTab] = useState<'earnings' | 'withdrawals'>('earnings');

    /* ======================= EARNINGS ======================= */
    const [earningStats, setEarningStats] = useState({
        balance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
    });

    const [transactions, setTransactions] = useState<any[]>([]);
    const [earningLoading, setEarningLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [typeFilter, setTypeFilter] = useState<TransactionType>('ALL');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const fetchEarnings = useCallback(async () => {
        if (!teacher) return;

        setEarningLoading(true);
        try {
            const statsRes = await teacherEarningsApi.getEarningsStats();
            if (statsRes.ok) setEarningStats(statsRes.data);

            const historyRes = await teacherEarningsApi.getEarningsHistory({
                page,
                limit: 10,
                type: typeFilter === 'ALL' ? undefined : typeFilter,
                startDate: dateRange?.from
                    ? format(dateRange.from, 'yyyy-MM-dd')
                    : undefined,
                endDate: dateRange?.to
                    ? format(dateRange.to, 'yyyy-MM-dd')
                    : undefined,
            });

            if (historyRes.ok) {
                setTransactions(historyRes.data.data);
                setTotalPages(historyRes.data.totalPages || 1);
            }
        } finally {
            setEarningLoading(false);
        }
    }, [teacher, page, typeFilter, dateRange]);

    useEffect(() => {
        fetchEarnings();
    }, [fetchEarnings]);

    useEffect(() => {
        setPage(1);
    }, [typeFilter, dateRange]);

    const hasActiveFilters =
        typeFilter !== 'ALL' || dateRange?.from || dateRange?.to;

    /* ======================= WITHDRAWALS ======================= */
    const [walletStats, setWalletStats] = useState<WalletStats>({
        balance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
    });

    const [payoutHistory, setPayoutHistory] = useState<IPayout[]>([]);
    const [withdrawLoading, setWithdrawLoading] = useState(true);

    const fetchWithdrawals = useCallback(async () => {
        setWithdrawLoading(true);
        try {
            const [statsRes, historyRes] = await Promise.all([
                teacherPayoutApi.getWalletStats(),
                teacherPayoutApi.getPayoutHistory(),
            ]);

            if (statsRes.ok) setWalletStats(statsRes.data);
            if (historyRes.ok) setPayoutHistory(historyRes.data);
        } finally {
            setWithdrawLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'withdrawals') fetchWithdrawals();
    }, [activeTab, fetchWithdrawals]);

    const getStatusBadge = (status: PayoutStatus) => {
        if (status === PayoutStatus.PENDING)
            return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
        if (status === PayoutStatus.APPROVED)
            return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
        if (status === PayoutStatus.REJECTED)
            return <Badge variant="destructive">Rejected</Badge>;
        return <Badge>{status}</Badge>;
    };

    if (!teacher) {
        return <div className="text-center mt-20 text-gray-500">Loading profile…</div>;
    }

    return (
        <>
            <Header />

            <main className="container mx-auto min-h-screen bg-gray-50 p-6 md:p-10">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Wallet</h1>
                    <p className="text-gray-500">Manage earnings & withdrawals</p>
                </div>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                    <TabsList className="mb-6 w-full grid grid-cols-2 h-11">
                        <TabsTrigger
                            value="earnings"
                            className="w-full text-sm"
                        >
                            Earnings
                        </TabsTrigger>

                        <TabsTrigger
                            value="withdrawals"
                            className="w-full text-sm"
                        >
                            Withdrawals
                        </TabsTrigger>
                    </TabsList>



                    {/* ===================== EARNINGS TAB ===================== */}
                    <TabsContent value="earnings">
                        <div className="flex justify-between mb-6">
                            <h2 className="text-xl font-semibold">Earnings</h2>
                            <RequestPayoutDialog
                                balance={earningStats.balance}
                                onSuccess={fetchEarnings}
                            />
                        </div>

                        <EarningsStats stats={earningStats} />

                        <div className="bg-white rounded-xl border p-6 mt-8">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <Select
                                    value={typeFilter}
                                    onValueChange={(v) => setTypeFilter(v as TransactionType)}
                                >
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Filter type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All</SelectItem>
                                        <SelectItem value="COURSE">Course</SelectItem>
                                        <SelectItem value="CALL">Call</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-64 justify-start">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateRange?.from
                                                ? dateRange.to
                                                    ? `${format(dateRange.from, 'LLL dd, y')} - ${format(
                                                        dateRange.to,
                                                        'LLL dd, y'
                                                    )}`
                                                    : format(dateRange.from, 'LLL dd, y')
                                                : 'Pick date range'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Calendar
                                            mode="range"
                                            selected={dateRange}
                                            onSelect={setDateRange}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>

                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        className="text-red-600"
                                        onClick={() => {
                                            setTypeFilter('ALL');
                                            setDateRange(undefined);
                                        }}
                                    >
                                        <RotateCw className="w-4 h-4 mr-1" />
                                        Clear
                                    </Button>
                                )}
                            </div>

                            <TransactionTable
                                transactions={transactions}
                                loading={earningLoading}
                            />

                            {totalPages > 1 && (
                                <div className="flex justify-center gap-4 mt-6">
                                    <Button
                                        variant="outline"
                                        disabled={page === 1}
                                        onClick={() => setPage((p) => p - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        disabled={page === totalPages}
                                        onClick={() => setPage((p) => p + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* ===================== WITHDRAWALS TAB ===================== */}
                    <TabsContent value="withdrawals">
                        <div className="flex justify-between mb-6">
                            <h2 className="text-xl font-semibold">Withdrawals</h2>
                            <RequestPayoutDialog
                                balance={walletStats.balance}
                                onSuccess={fetchWithdrawals}
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            

                            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-green-100">
                                        Current Balance
                                    </CardTitle>
                                    <Wallet className="h-4 w-4 text-green-100" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">₹{walletStats.balance.toFixed(2)}</div>
                                    <p className="text-xs text-green-100 mt-1">Available for withdrawal</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Total Withdrawn</CardTitle>
                                </CardHeader>
                                <CardContent className="text-2xl font-bold">
                                    ₹{walletStats.totalWithdrawn.toFixed(2)}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Pending Requests</CardTitle>
                                </CardHeader>
                                <CardContent className="text-2xl font-bold">
                                    {payoutHistory.filter(
                                        (p) => p.status === PayoutStatus.PENDING
                                    ).length}
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Withdrawal History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {withdrawLoading ? (
                                    <div className="text-center py-10">Loading…</div>
                                ) : payoutHistory.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">
                                        No withdrawal history found
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Admin Note</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {payoutHistory.map((p) => (
                                                <TableRow key={p._id}>
                                                    <TableCell>
                                                        {format(new Date(p.createdAt), 'MMM dd, yyyy')}
                                                    </TableCell>
                                                    <TableCell>${p.amount.toFixed(2)}</TableCell>
                                                    <TableCell>{getStatusBadge(p.status)}</TableCell>
                                                    <TableCell className="text-sm text-gray-500">
                                                        {p.adminNote || '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </>
    );
}
