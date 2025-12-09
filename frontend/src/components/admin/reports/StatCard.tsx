
import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    color?: string;
    subtext?: string;
}

export default function StatCard({ title, value, icon, color = 'blue', subtext }: StatCardProps) {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between`}>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                {subtext && <p className="text-xs text-green-500 mt-1">{subtext}</p>}
            </div>
            {icon && (
                <div className={`p-3 rounded-full bg-${color}-50 text-${color}-600`}>
                    {icon}
                </div>
            )}
        </div>
    );
}
