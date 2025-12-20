'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { adminApiMethods } from '@/services/APIservices/adminApiService';
import { IPayout, PayoutStatus } from '@/types/payout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-toastify';
import { Check, X } from 'lucide-react';
import RejectPayoutDialog from '@/components/admin/payouts/RejectPayoutDialog';
import { format } from 'date-fns';

export default function AdminPayoutsPage() {
    const [payouts, setPayouts] = useState<IPayout[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('All');

    // Dialog state
    const [rejectDialog, setRejectDialog] = useState<{ open: boolean; id: string | null }>({
        open: false,
        id: null,
    });

    const fetchPayouts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminApiMethods.getPayouts(filter);
            if (res.ok) {
                setPayouts(res.data);
                console.log("setpayout",res.data)
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch payouts');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchPayouts();
    }, [fetchPayouts]);

    const handleApprove = async (id: string) => {
        try {
            if (!confirm('Are you sure you want to approve this payout? This action cannot be undone.')) return;
            await adminApiMethods.approvePayout(id);
            toast.success('Payout approved successfully');
            fetchPayouts();
        } catch (error) {
            console.error(error);
            toast.error('Failed to approve payout');
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teacher Payouts</h1>
                    <p className="text-muted-foreground">Manage withdrawal requests from teachers.</p>
                </div>
                <div className="w-[200px]">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Requests</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : payouts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No payout requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            payouts.map((payout) => (
                                <TableRow key={payout._id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {typeof payout.teacherId === 'object' ? payout.teacherId.name : 'Unknown'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {typeof payout.teacherId === 'object' ? payout.teacherId.email : payout.teacherId}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold text-green-600">${payout.amount.toFixed(2)}</TableCell>
                                    <TableCell>{format(new Date(payout.createdAt), 'MMM dd, yyyy')}</TableCell>
                                    <TableCell>{payout.method.replace('_', ' ')}</TableCell>
                                    <TableCell className="max-w-xs truncate text-xs text-gray-500" title={payout.details?.info}>
                                        {payout.details?.info || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {payout.status === PayoutStatus.PENDING && (
                                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                                        )}
                                        {payout.status === PayoutStatus.APPROVED && (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                                        )}
                                        {payout.status === PayoutStatus.REJECTED && (
                                            <Badge variant="destructive">Rejected</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {payout.status === PayoutStatus.PENDING ? (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                                    onClick={() => handleApprove(payout._id)}
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                                    onClick={() => setRejectDialog({ open: true, id: payout._id })}
                                                >
                                                    <X className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">
                                                {payout.status === PayoutStatus.APPROVED ? (
                                                    <span className="flex items-center justify-end text-green-600">
                                                        <Check className="h-4 w-4 mr-1" /> Paid
                                                    </span>
                                                ) : (
                                                    <span className="text-xs">
                                                        {payout.adminNote || 'Rejected'}
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <RejectPayoutDialog
                open={rejectDialog.open}
                onOpenChange={(val) => setRejectDialog(prev => ({ ...prev, open: val }))}
                payoutId={rejectDialog.id}
                onSuccess={fetchPayouts}
            />
        </div>
    );
}
