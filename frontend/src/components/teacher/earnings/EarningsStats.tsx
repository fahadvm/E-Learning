import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {  Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface EarningsStatsProps {
    stats: {
        balance: number;
        totalEarned: number;
        totalWithdrawn: number;
    };
}

export default function EarningsStats({ stats }: EarningsStatsProps) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-green-100">
                        Current Balance
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-green-100" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.balance)}</div>
                    <p className="text-xs text-green-100 mt-1">Available for withdrawal</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Total Earned
                    </CardTitle>
                    <ArrowUpCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalEarned)}</div>
                    <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Total Withdrawn
                    </CardTitle>
                    <ArrowDownCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalWithdrawn)}</div>
                    <p className="text-xs text-gray-500 mt-1">Successfully processed</p>
                </CardContent>
            </Card>
        </div>
    );
}
