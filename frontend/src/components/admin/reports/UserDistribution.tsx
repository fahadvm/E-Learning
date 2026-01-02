
'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface UserStatistics {
    name: string;
    value: number;
}

interface UserDistributionProps {
    data: UserStatistics[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function UserDistribution({ data }: UserDistributionProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4">User Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
