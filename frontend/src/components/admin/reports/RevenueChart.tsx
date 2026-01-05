
'use client';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface RevenueData {
    _id: number;
    revenue: number;
}

interface RevenueChartProps {
    monthlyData: RevenueData[];
    yearlyData?: RevenueData[]; // Make optional to avoid initial errors
}

export default function RevenueChart({ monthlyData, yearlyData = [] }: RevenueChartProps) {
    const [view, setView] = useState<'monthly' | 'yearly'>('monthly');

    const formattedMonthly = monthlyData.map(item => ({
        label: new Date(0, item._id - 1).toLocaleString('default', { month: 'short' }),
        revenue: item.revenue
    }));

    const formattedYearly = yearlyData.map(item => ({
        label: item._id.toString(),
        revenue: item.revenue
    }));

    const data = view === 'monthly' ? formattedMonthly : formattedYearly;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Revenue Analytics</h3>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setView('monthly')}
                        className={`px-3 py-1 text-sm rounded-md transition ${view === 'monthly' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setView('yearly')}
                        className={`px-3 py-1 text-sm rounded-md transition ${view === 'yearly' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Yearly
                    </button>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `₹${value}`}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value) => [`₹${value}`, 'Revenue']}
                    />
                    <Bar
                        dataKey="revenue"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
