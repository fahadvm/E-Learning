"use client";

import { useState, useEffect } from "react";
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
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showErrorToast } from "@/utils/Toast";

export default function TrackerPage() {
    const [range, setRange] = useState<"week" | "month" | "year">("month");
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrackerData();
    }, [range]);

    const fetchTrackerData = async () => {
        try {
            setLoading(true);
            const res = await companyApiMethods.getTrackerStats(range);
            setStats(res.data);
        } catch (error: any) {
            console.error("Failed to fetch tracker stats:", error);
            showErrorToast(error?.response?.data?.message || "Failed to load tracker data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-background">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 mt-10 overflow-y-auto flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading tracker data...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex h-screen bg-background">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 mt-10 overflow-y-auto flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-muted-foreground">No data available</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

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
                                {(["week", "month", "year"] as const).map(r => (
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
                                <p className="text-sm text-muted-foreground">Active courses</p>
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
                                {stats.graph && stats.graph.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats.graph}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="label" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="hours" fill="var(--color-chart-1)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        No learning activity data available
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Most Active */}
                        <Card>
                            <CardHeader><CardTitle>Top 10 Most Active Learners</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {stats.mostActive && stats.mostActive.length > 0 ? (
                                    stats.mostActive.map((u: any) => (
                                        <div key={u.id} className="flex justify-between p-3 border rounded-lg">
                                            <p>{u.name}</p>
                                            <p className="text-sm text-muted-foreground">{u.hours}h • {u.progress}%</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-4">No active learners yet</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Least Active */}
                        <Card>
                            <CardHeader><CardTitle>10 Least Active Learners</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {stats.leastActive && stats.leastActive.length > 0 ? (
                                    stats.leastActive.map((u: any) => (
                                        <div key={u.id} className="flex justify-between p-3 border rounded-lg">
                                            <p>{u.name}</p>
                                            <p className="text-sm text-muted-foreground">{u.hours}h • {u.progress}%</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-4">No data available</p>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </main>
            </div>
        </div>
    );
}
