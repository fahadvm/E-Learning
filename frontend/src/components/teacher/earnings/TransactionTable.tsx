import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Transaction {
    _id: string;
    type: string;
    amount: number;
    description?: string; // or mapped from other fields
    createdAt: string;
    status: string;
    // backend specific fields for display
    courseId?: { title: string };
    meetingId?: { title: string }; // Assuming population, otherwise we might just have ID
    // Actually, standard Transaction model might not populate deeply by default unless service does.
    // Service code: this._transactionRepo.find(query, ...).
    // TransactionRepository find usually just returns docs.
    // We might need to ensure backend populates or just display generic info.
    // For now, let's assume we might need to handle raw IDs or simple types.
    // Adjusting based on `TeacherEarningsService` implementation which returns `ITransaction`.

    // Checking Transaction model:
    // userId, teacherId, courseId, meetingId are Refs.
    // To display names, we need population.
    // The service didn't explicitly populate. This is a potential issue.
    // I will check if I need to update service to populate.
    // For now, I'll render what I can.

    courseTitle?: string; // Helper if we populate
    studentName?: string; // Helper if we populate
    companyName?: string; // Helper if we populate
}

interface TransactionTableProps {
    transactions: any[]; // Using any to be flexible with backend response for now
    loading: boolean;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);

export default function TransactionTable({ transactions, loading }: TransactionTableProps) {
    if (loading) {
        return <div className="text-center py-10">Loading transactions...</div>;
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed text-gray-500">
                No transactions found matching your filters.
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-white overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((txn) => (
                        <TableRow key={txn._id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                                {format(new Date(txn.createdAt), 'MMM dd, yyyy')}
                                <div className="text-xs text-gray-500">
                                    {format(new Date(txn.createdAt), 'hh:mm a')}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={txn.type === 'TEACHER_EARNING' ? 'default' : 'secondary'}>
                                    {txn.type.replace('_', ' ')}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="max-w-[300px] truncate" title={txn.description || 'Transaction'}>
                                    {/* Ideally display Course Name or Student Name here.
                      If not populated, we might show "Course Sale" or "Booking".
                  */}
                                    {txn.description || (txn.courseId ? 'Course Sale' : txn.meetingId ? 'Video Call Booking' : 'Transaction')}
                                </div>
                            </TableCell>
                            <TableCell className={`text-right font-bold ${txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {txn.amount >= 0 ? '+' : ''}{formatCurrency(txn.amount)}
                            </TableCell>
                            <TableCell className="text-right">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Completed
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
