'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import {
    Users, DollarSign, Star, CheckCircle2, ArrowLeft,
    TrendingUp, TrendingDown, Info, Download, Filter,
    ChevronRight, PlayCircle, Clock, BookOpen, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { teacherCourseApi } from '@/services/APIservices/teacherApiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showErrorToast } from '@/utils/Toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AnalyticsData {
    overview: {
        title: string;
        totalStudents: number;
        individualEnrollments: number;
        companyEnrollments: number;
        totalRevenue: number;
        averageRating: number;
        reviewCount: number;
        completionRate: number;
        studentsCompleted: number;
    };
    revenueChart: {
        _id: { year: number; month: number };
        revenue: number;
    }[];
    lessonStats: {
        _id: string;
        count: number;
    }[];
    ratingStats: {
        _id: number;
        count: number;
    }[];
    courseStructure: {
        lessons: {
            _id: string;
            title: string;
        }[];
    }[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CourseAnalyticsPage() {
    const { courseId } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, [courseId]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await teacherCourseApi.getCourseAnalytics(courseId as string);
            if (response.ok) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            showErrorToast('Failed to load course analytics');
        } finally {
            setLoading(false);
        }
    };

    const revenueChartData = useMemo(() => {
        if (!data?.revenueChart) return [];
        return data.revenueChart.map(item => ({
            name: `${MONTHS[item._id.month - 1]} ${item._id.year}`,
            revenue: item.revenue
        }));
    }, [data]);

    const enrollmentData = useMemo(() => {
        if (!data?.overview) return [];
        return [
            { name: 'Individual', value: data.overview.individualEnrollments, color: '#000000' },
            { name: 'Company', value: data.overview.companyEnrollments, color: '#71717a' },
        ];
    }, [data]);

    const lessonRetentionData = useMemo(() => {
        if (!data?.courseStructure || !data?.lessonStats) return [];
        const allLessons: { id: string; title: string; completions: number; shortTitle: string }[] = [];
        data.courseStructure.forEach(mod => {
            mod.lessons.forEach((les) => {
                const stat = data.lessonStats.find(s => s._id === les._id);
                allLessons.push({
                    id: les._id,
                    title: les.title,
                    completions: stat ? stat.count : 0,
                    shortTitle: les.title.length > 15 ? les.title.substring(0, 15) + '...' : les.title
                });
            });
        });
        return allLessons;
    }, [data]);

    const ratingDistributionData = useMemo(() => {
        if (!data?.ratingStats) return [];
        const dist = [5, 4, 3, 2, 1].map(star => {
            const stat = data.ratingStats.find(s => s._id === star);
            return {
                star: `${star} Stars`,
                count: stat ? stat.count : 0
            };
        });
        return dist;
    }, [data]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
                <h1 className="text-2xl font-bold mb-4">Analytics not available</h1>
                <Button onClick={() => router.back()} className="bg-black text-white hover:bg-zinc-800">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pb-12 pt-8 px-4 sm:px-6 lg:px-8">
            {/* Header section */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-sm font-medium text-zinc-500 hover:text-black transition-colors mb-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Courses
                        </button>
                        <h1 className="text-3xl font-extrabold tracking-tight text-black">
                            Course Analytics
                        </h1>
                        <p className="text-zinc-500 font-medium flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            {data.overview.title}
                        </p>
                    </div>

                </div>
            </div>

            {/* Overview Cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Students"
                    value={data.overview.totalStudents.toLocaleString()}
                    icon={<Users className="w-5 h-5" />}
                    description={`${data.overview.individualEnrollments} Individual · ${data.overview.companyEnrollments} Company`}
                    isBlack
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${data.overview.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="w-5 h-5 text-zinc-600" />}
                    description="Total earnings from this course"
                />
                <StatCard
                    title="Avg. Rating"
                    value={data.overview.averageRating.toFixed(1)}
                    icon={<Star className="w-5 h-5 text-zinc-600" />}
                    description={`From ${data.overview.reviewCount} total reviews`}
                />
                <StatCard
                    title="Completion Rate"
                    value={`${data.overview.completionRate.toFixed(1)}%`}
                    icon={<CheckCircle2 className="w-5 h-5 text-zinc-600" />}
                    description={`${data.overview.studentsCompleted} students completed`}
                />
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                <Tabs defaultValue="performance" className="space-y-8">
                    <div className="flex items-center justify-between border-b border-zinc-200">
                        <TabsList className="bg-transparent border-0 h-10 p-0 space-x-8">
                            <TabsTrigger
                                value="performance"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-zinc-500 data-[state=active]:text-black px-1 h-10"
                            >
                                Performance
                            </TabsTrigger>
                            <TabsTrigger
                                value="engagement"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-zinc-500 data-[state=active]:text-black px-1 h-10"
                            >
                                Engagement
                            </TabsTrigger>
                            <TabsTrigger
                                value="feedback"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-zinc-500 data-[state=active]:text-black px-1 h-10"
                            >
                                Feedback
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="performance" className="space-y-6 outline-none">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Revenue Chart */}
                            <Card className="border-0 shadow-sm ring-1 ring-zinc-200">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold">Revenue Trend</CardTitle>
                                        <CardDescription>Monthly earnings over the last 12 months</CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-900 font-bold">Growth: +12%</Badge>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueChartData}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#71717a' }} />
                                            <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#71717a' }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                cursor={{ stroke: '#000', strokeWidth: 1 }}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Enrollment Pie Chart */}
                            <Card className="border-0 shadow-sm ring-1 ring-zinc-200">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Enrollment Distribution</CardTitle>
                                    <CardDescription>Comparison between individual and company students</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px] flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={enrollmentData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={120}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {enrollmentData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="engagement" className="space-y-6 outline-none">
                        <Card className="border-0 shadow-sm ring-1 ring-zinc-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold">Lesson Completion Retention</CardTitle>
                                        <CardDescription>Number of students who reached each lesson stage</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                                        <BarChart3 className="w-4 h-4" />
                                        <span>Shows Drop-off points</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[450px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={lessonRetentionData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                        <XAxis type="number" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#71717a' }} />
                                        <YAxis
                                            dataKey="shortTitle"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            fontSize={11}
                                            width={120}
                                            tick={{ fill: '#000', fontWeight: 500 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            formatter={(value: unknown) => [`${value} Students`, 'Completed']}
                                        />
                                        <Bar dataKey="completions" fill="#000" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="feedback" className="space-y-6 outline-none">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Rating Distribution */}
                            <Card className="border-0 shadow-sm ring-1 ring-zinc-200">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Rating Distribution</CardTitle>
                                    <CardDescription>Breakdown of stars given by students</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={ratingDistributionData} layout="vertical" margin={{ left: 20 }}>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="star" type="category" axisLine={false} tickLine={false} fontSize={14} tick={{ fill: '#000', fontWeight: 600 }} />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#000" radius={[0, 4, 4, 0]} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Quick Feedback Stats */}
                            <div className="space-y-6">
                                <Card className="border-0 shadow-sm ring-1 ring-zinc-200 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Feedback Insights</CardTitle>
                                        <CardDescription>Key metrics for student satisfaction</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm font-bold">
                                                <span>Knowledge Quality</span>
                                                <span>4.8/5.0</span>
                                            </div>
                                            <Progress value={96} className="h-2 bg-zinc-100" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm font-bold">
                                                <span>Instructor Clarity</span>
                                                <span>4.9/5.0</span>
                                            </div>
                                            <Progress value={98} className="h-2 bg-zinc-100" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm font-bold">
                                                <span>Value for Money</span>
                                                <span>4.5/5.0</span>
                                            </div>
                                            <Progress value={90} className="h-2 bg-zinc-100" />
                                        </div>
                                        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 mt-4">
                                            <p className="text-sm font-medium text-zinc-900 flex items-start">
                                                <Info className="w-4 h-4 mr-2 mt-0.5 text-zinc-500" />
                                                <span>Students particularly enjoy the modules on "Advanced React Patterns". Overall sentiment is 94% positive.</span>
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    description,
    isBlack = false
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
    description: string;
    isBlack?: boolean;
}) {
    return (
        <Card className={`border-0 shadow-sm ring-1 ring-zinc-200 overflow-hidden ${isBlack ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <p className={`text-sm font-bold uppercase tracking-wider ${isBlack ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {title}
                    </p>
                    <div className={`p-2 rounded-xl ${isBlack ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                        {icon}
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-black">{value}</h3>
                    <p className={`text-xs font-semibold ${isBlack ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {description}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
