"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, CheckCircle, Clock, Trophy, BarChart3 } from "lucide-react";

interface CourseProgress {
    courseId: {
        _id: string;
        title: string;
    } | null;
    percentage: number;
    completedLessons: string[];
    completedModules: string[];
    lastVisitedTime?: string;
}

interface EmployeeProgressTabProps {
    progress: CourseProgress[];
    assignedPaths: any[];
}

export default function EmployeeProgressTab({ progress, assignedPaths }: EmployeeProgressTabProps) {
    // Calculate unique courses from all assigned learning paths
    const uniqueAssignedCourseIds = new Set<string>();
    assignedPaths.forEach((path) => {
        path.learningPathId?.courses?.forEach((course: any) => {
            if (course.courseId) uniqueAssignedCourseIds.add(course.courseId.toString());
        });
    });

    const activeCourses = progress.filter(p => p.percentage > 0 && p.percentage < 100);
    const completedCourses = progress.filter(p => p.percentage === 100);
    const totalAssignedCount = uniqueAssignedCourseIds.size;
    const totalProgressCount = progress.length;

    return (
        <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Assigned", value: totalAssignedCount, icon: PlayCircle, color: "text-blue-400" },
                    { label: "In Progress", value: activeCourses.length, icon: Clock, color: "text-amber-400" },
                    { label: "Completed", value: completedCourses.length, icon: CheckCircle, color: "text-green-400" },
                    { label: "Avg. Completion", value: totalProgressCount > 0 ? `${Math.round(progress.reduce((acc, p) => acc + p.percentage, 0) / totalProgressCount)}%` : "0%", icon: BarChart3, color: "text-primary" },
                ].map((stat, i) => (
                    <Card key={i} className="bg-white/5 border-white/10 text-white">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Learning */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-primary" /> Active Courses
                    </h3>
                    {activeCourses.length === 0 ? (
                        <Card className="bg-white/5 border-white/10 text-white">
                            <CardContent className="p-12 text-center text-gray-500">
                                No courses currently in progress.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {activeCourses.map((course) => (
                                <Card key={course.courseId?._id || Math.random().toString()} className="bg-white/5 border-white/10 text-white">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg">{course.courseId?.title || "Unknown Course"}</h4>
                                                <p className="text-sm text-gray-400">
                                                    Last active: {course.lastVisitedTime ? new Date(course.lastVisitedTime).toLocaleDateString() : "Never"}
                                                </p>
                                            </div>
                                            <Badge className="bg-primary/20 text-primary border-primary/30">
                                                {course.percentage}%
                                            </Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-gray-400">
                                                <span>Course Completion</span>
                                                <span>{course.completedLessons.length} lessons completed</span>
                                            </div>
                                            <Progress value={course.percentage} className="h-2 bg-white/10" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Achievements */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" /> Recent Completions
                    </h3>
                    {completedCourses.length === 0 ? (
                        <Card className="bg-white/5 border-white/10 text-white">
                            <CardContent className="p-12 text-center text-gray-500">
                                No courses completed yet.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {completedCourses.map((course) => (
                                <Card key={course.courseId?._id || Math.random().toString()} className="bg-white/5 border-white/10 text-white border-l-4 border-l-green-500">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg">{course.courseId?.title || "Unknown Course"}</h4>
                                            <p className="text-sm text-gray-400">Completed on: {new Date().toLocaleDateString()}</p>
                                        </div>
                                        <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
