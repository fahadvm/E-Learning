
'use client';

import { useState, useEffect } from 'react';
import { adminApiMethods } from '@/services/APIservices/adminApiService';
import StatCard from '@/components/admin/reports/StatCard';
import RevenueChart from '@/components/admin/reports/RevenueChart';
import UserDistribution from '@/components/admin/reports/UserDistribution';
import TopCoursesTable from '@/components/admin/reports/TopCoursesTable';
import ActiveTeachers from '@/components/admin/reports/ActiveTeachers';
import { Download, DollarSign, Users, Briefcase, GraduationCap, FileText } from 'lucide-react';
import { showErrorToast, showSuccessToast } from '@/utils/Toast';

export default function AdminReportsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await adminApiMethods.getDashboardStats();
                if (res.ok) {
                    setData(res.data);
                }
            } catch (error) {
                console.error(error);
                showErrorToast('Failed to load reports');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleExport = (type: 'csv' | 'pdf') => {
        if (!data) return;

        if (type === 'csv') {
            const csvContent = [
                'Month,Revenue',
                ...data.monthlyRevenue.map((item: any) => {
                    const month = new Date(0, item._id - 1).toLocaleString('default', { month: 'long' });
                    return `${month},${item.revenue}`;
                })
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `revenue_report_${new Date().toISOString()}.csv`;
            a.click();
           showSuccessToast('Revenue Report Downloaded');
        } else if (type === 'pdf') {
            import('jspdf').then(jsPDF => {
                import('jspdf-autotable').then(() => {
                    const doc = new jsPDF.default();

                    doc.setFontSize(18);
                    doc.text('Admin Report', 14, 22);
                    doc.setFontSize(12);
                    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

                    // Stats Summary
                    doc.setFontSize(14);
                    doc.text('Summary Stats', 14, 45);

                    const statsData = [
                        ['Total Revenue', `Rs. ${data.stats.totalRevenue}`],
                        ['Students', data.stats.totalStudents],
                        ['Teachers', data.stats.totalTeachers],
                        ['Companies', data.stats.totalCompanies]
                    ];

                    (doc as any).autoTable({
                        startY: 50,
                        head: [['Metric', 'Value']],
                        body: statsData,
                    });

                    // Top Courses
                    let finalY = (doc as any).lastAutoTable.finalY + 15;
                    doc.text('Top Selling Courses', 14, finalY);

                    const coursesData = data.topCourses.map((c: any) => [c.title, c.sales, `Rs. ${c.revenue}`]);

                    (doc as any).autoTable({
                        startY: finalY + 5,
                        head: [['Course', 'Sales', 'Revenue']],
                        body: coursesData,
                    });

                    doc.save(`admin_report_${new Date().toISOString().split('T')[0]}.pdf`);
                    showSuccessToast('PDF Report Downloaded');
                });
            });
        }
    };

    if (loading) return <div className="p-6">Loading reports...</div>;
    if (!data) return <div className="p-6">No data available</div>;

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Analytics & Reports</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleExport('csv')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Download size={16} /> Export Revenue CSV
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        <FileText size={16} /> Export PDF Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Revenue" value={`₹${data.stats.totalRevenue}`} icon={<DollarSign />} color="green" />
                <StatCard title="Students" value={data.stats.totalStudents} icon={<GraduationCap />} color="blue" />
                <StatCard title="Teachers" value={data.stats.totalTeachers} icon={<Users />} color="purple" />
                <StatCard title="Companies" value={data.stats.totalCompanies} icon={<Briefcase />} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart data={data.monthlyRevenue} />
                </div>
                <div>
                    <UserDistribution data={data.userDistribution} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopCoursesTable data={data.topCourses} />
                <ActiveTeachers data={data.activeTeachers} />
            </div>
        </div>
    );
}
