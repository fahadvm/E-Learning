"use client";

import { useEffect, useState } from "react";
import Header from "@/components/company/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const mockData = {
    week: {
        totalEmployees: 245,
        totalLearningHours: 385,
        avgCompletionRate: 71.2,
        totalCourses: 120,
        graph: [
            { label: "Mon", hours: 32 },
            { label: "Tue", hours: 48 },
            { label: "Wed", hours: 60 },
            { label: "Thu", hours: 75 },
            { label: "Fri", hours: 90 },
            { label: "Sat", hours: 50 },
            { label: "Sun", hours: 30 },
        ],
        mostActive: [
            { id: 1, name: "Alex Johnson", hours: 22, progress: 92 },
            { id: 2, name: "Lisa Chen", hours: 18, progress: 88 },
            { id: 3, name: "Robert Martinez", hours: 16, progress: 85 },
        ],
        leastActive: [
            { id: 6, name: "Tom Walker", hours: 1, progress: 12 },
            { id: 7, name: "Kevin Hart", hours: 1, progress: 10 },
            { id: 8, name: "Sanjay Kumar", hours: 0.5, progress: 5 },
        ],
    },

    month: {
        totalEmployees: 245,
        totalLearningHours: 2485,
        avgCompletionRate: 78.5,
        totalCourses: 120,

        graph: [
            { label: "Week 1", hours: 520 },
            { label: "Week 2", hours: 600 },
            { label: "Week 3", hours: 640 },
            { label: "Week 4", hours: 725 },
        ],
        mostActive: [
            { id: 1, name: "Alex Johnson", hours: 145, progress: 91 },
            { id: 2, name: "Lisa Chen", hours: 204, progress: 95 },
            { id: 3, name: "Robert Martinez", hours: 178, progress: 93 },
        ],
        leastActive: [
            { id: 6, name: "Tom Walker", hours: 5, progress: 20 },
            { id: 7, name: "Kevin Hart", hours: 4, progress: 18 },
            { id: 8, name: "Sanjay Kumar", hours: 3, progress: 15 },
        ],
    },

    year: {
        totalEmployees: 245,
        totalLearningHours: 17890,
        avgCompletionRate: 84.3,
        totalCourses: 120,

        graph: [
            { label: "Jan", hours: 1200 },
            { label: "Feb", hours: 1400 },
            { label: "Mar", hours: 1600 },
            { label: "Apr", hours: 1550 },
            { label: "May", hours: 1700 },
            { label: "Jun", hours: 1500 },
            { label: "Jul", hours: 1650 },
            { label: "Aug", hours: 1720 },
            { label: "Sep", hours: 1480 },
            { label: "Oct", hours: 1800 },
            { label: "Nov", hours: 1750 },
            { label: "Dec", hours: 1890 },
        ],
        mostActive: [
            { id: 1, name: "Alex Johnson", hours: 985, progress: 96 },
            { id: 2, name: "Lisa Chen", hours: 912, progress: 94 },
            { id: 3, name: "Robert Martinez", hours: 878, progress: 92 },
        ],
        leastActive: [
            { id: 6, name: "Tom Walker", hours: 12, progress: 14 },
            { id: 7, name: "Kevin Hart", hours: 10, progress: 13 },
            { id: 8, name: "Sanjay Kumar", hours: 9, progress: 10 },
        ],
    },
};

export default function TrackerPage() {
    const [range, setRange] = useState("month");
    const [stats, setStats] = useState(mockData[range]);

    useEffect(() => {
        setStats(mockData[range]);
    }, [range]);

    return (
        <div className="flex h-screen bg-background">
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 mt-10 overflow-y-auto">
                    <div className="p-8 space-y-8">

                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Learning Tracker</h1>
                                <p className="text-muted-foreground">Monitor employee engagement and learning performance</p>
                            </div>

                            <div className="flex gap-3">
                                {["week", "month", "year"].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setRange(r)}
                                        className={`px-4 py-2 rounded ${range === r ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                                    >
                                        {r.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <Card><CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Total Employees</p>
                                <p className="text-3xl font-bold">{stats.totalEmployees}</p>
                            </CardContent></Card>

                            <Card><CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Total Learning Hours</p>
                                <p className="text-3xl font-bold">{stats.totalLearningHours}h</p>
                            </CardContent></Card>

                            <Card><CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Average Completion Rate</p>
                                <p className="text-3xl font-bold">{stats.avgCompletionRate}%</p>
                            </CardContent></Card>
                            <Card><CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Acitve courses</p>
                                <p className="text-3xl font-bold">{stats.totalCourses}</p>
                            </CardContent></Card>
                        </div>

                        {/* Learning Activity Graph */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Learning Hours Trend</CardTitle>
                                <CardDescription>Based on selected time range</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.graph}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="label" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="hours" fill="var(--color-chart-1)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Most Active */}
                        <Card>
                            <CardHeader><CardTitle>Top 10 Most Active Learners</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {stats.mostActive.map((u) => (
                                    <div key={u.id} className="flex justify-between p-3 border rounded-lg">
                                        <p>{u.name}</p>
                                        <p className="text-sm text-muted-foreground">{u.hours}h • {u.progress}%</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Least Active */}
                        <Card>
                            <CardHeader><CardTitle>10 Least Active Learners</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {stats.leastActive.map((u) => (
                                    <div key={u.id} className="flex justify-between p-3 border rounded-lg">
                                        <p>{u.name}</p>
                                        <p className="text-sm text-muted-foreground">{u.hours}h • {u.progress}%</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                    </div>
                </main>
            </div>
        </div>
    );
}
