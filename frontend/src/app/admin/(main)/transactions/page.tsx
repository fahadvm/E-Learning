
'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/reusable/DataTable';
import { adminApiMethods } from '@/services/APIservices/adminApiService';
import { showErrorToast } from '@/utils/Toast';
import { Download } from 'lucide-react';
import { TransactionRow, TransactionQuery } from '@/types/admin/adminTypes';

export default function AdminTransactionsPage() {
    const [data, setData] = useState<TransactionRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const query: TransactionQuery = { page, limit: 10 };
            if (search) query.search = search;
            if (startDate) query.startDate = startDate;
            if (endDate) query.endDate = endDate;
            if (status) query.status = status;

            const res = await adminApiMethods.getTransactions(query);
            if (res.ok) {
                setData(res.data.transactions);
                setTotalPages(res.data.totalPages);
            }
        } catch (error) {
            console.error(error);
            showErrorToast('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, search, startDate, endDate, status]);

    const handleExportCSV = () => {
        if (!data.length) return;

        const headers = ['Transaction ID', 'User', 'Type/Role', 'Amount', 'Payment Method', 'Status', 'Date'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => {
                const user = row.userId || row.teacherId || row.companyId;
                const userName = user?.name || 'Unknown';
                const role = row.type;
                return [
                    row._id,
                    `"${userName}"`,
                    role,
                    row.amount,
                    row.paymentMethod,
                    row.paymentStatus,
                    new Date(row.createdAt).toLocaleDateString()
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString()}.csv`;
        a.click();
    };

    const columns = [
        {
            key: '_id' as keyof TransactionRow,
            label: 'Transaction ID',
            render: (row: TransactionRow) => (
                <span className="font-mono text-sm">
                    {row._id.slice(0, 6)}
                </span>
            ),
        },
        {
            key: 'userId' as keyof TransactionRow,
            label: 'User Name',
            render: (row: TransactionRow) => {
                const user = row.userId || row.teacherId || row.companyId;
                return (
                    <div className="flex items-center gap-2">
                        {user?.avatar && <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full" />}
                        {user?.name || 'Unknown'}
                    </div>
                );
            }
        },
        { key: 'type' as keyof TransactionRow, label: 'Type' },
        {
            key: 'amount' as keyof TransactionRow,
            label: 'Amount',
            render: (row: TransactionRow) => `₹${row.amount}`
        },
        { key: 'paymentMethod' as keyof TransactionRow, label: 'Method' },
        {
            key: 'paymentStatus' as keyof TransactionRow,
            label: 'Status',
            render: (row: TransactionRow) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                    row.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {row.paymentStatus}
                </span>
            )
        },
        {
            key: 'createdAt' as keyof TransactionRow,
            label: 'Date',
            render: (row: TransactionRow) => new Date(row.createdAt).toLocaleDateString()
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>

                <div className="flex gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="SUCCESS">Success</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                    </select>
                </div>
                <button
                    onClick={() => { setStartDate(''); setEndDate(''); setStatus(''); setSearch(''); setPage(1); }}
                    className="text-sm text-blue-600 hover:text-blue-800 pb-2"
                >
                    Clear Filters
                </button>
            </div>

            <DataTable
                data={data}
                columns={columns}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onSearch={setSearch}
                searchPlaceholder="Search by ID..."

            />
        </div>
    );
}
