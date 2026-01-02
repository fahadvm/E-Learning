"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Clock, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { AssignedLearningPath } from "@/types/employee/employeeTypes";

interface EmployeeLearningPathsTabProps {
    assignedPaths: AssignedLearningPath[];
    onAssignClick: () => void;
}

export default function EmployeeLearningPathsTab({ assignedPaths, onAssignClick }: EmployeeLearningPathsTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Assigned Learning Paths</h3>
                <Button
                    onClick={onAssignClick}
                    className="bg-primary hover:bg-primary/80 text-white flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Assign Learning Path
                </Button>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                {assignedPaths.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <BookOpen className="w-12 h-12 text-gray-600 mb-4" />
                        <p className="text-gray-400">No learning paths assigned yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-white">
                            <thead className="bg-white/5 border-b border-white/10 text-left">
                                <tr>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-gray-400">Path Name</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-gray-400">Courses</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-gray-400">Progress</th>
                                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedPaths.map((path) => (
                                    <tr key={path._id} className="border-b border-white/10 hover:bg-white/5 transition">
                                        <td className="px-6 py-4 font-medium">{path.learningPathId?.title || "N/A"}</td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {path.learningPathId?.courses?.length || 0} Courses
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden min-w-[100px]">
                                                    <div
                                                        className="h-full bg-primary transition-all"
                                                        style={{ width: `${path.percentage || 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-gray-300">{path.percentage || 0}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {path.status === "completed" ? (
                                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1 w-fit">
                                                    <CheckCircle2 className="w-3 h-3" /> Completed
                                                </Badge>
                                            ) : path.status === "active" ? (
                                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 flex items-center gap-1 w-fit">
                                                    <Clock className="w-3 h-3" /> In Progress
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 flex items-center gap-1 w-fit">
                                                    <Circle className="w-3 h-3" /> Not Started
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
