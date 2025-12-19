"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Mail,
    Briefcase,
    Building,
    Calendar,
    Shield,
    Ban,
    CheckCircle,
    MoreVertical,
    BookOpen,
} from "lucide-react";

import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { IAdminEmployee } from "@/types/admin/employee";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EmployeeDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const employeeId = params.id as string;

    const [employee, setEmployee] = useState<IAdminEmployee | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    const fetchEmployee = async () => {
        try {
            setLoading(true);
            const res = await adminApiMethods.getEmployeeFullById(employeeId);
            setEmployee(res.data);
        } catch (error) {
            console.error("Failed to fetch employee details:", error);
            showErrorToast("Failed to fetch employee details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (employeeId) fetchEmployee();
    }, [employeeId]);

    const handleToggleBlock = async () => {
        if (!employee) return;
        setActionLoading(true);
        try {
            if (employee.isBlocked) {
                await adminApiMethods.unblockAdminEmployee(employee._id);
                showSuccessToast("Employee unblocked successfully");
            } else {
                await adminApiMethods.blockAdminEmployee(employee._id);
                showSuccessToast("Employee blocked successfully");
            }
            fetchEmployee();
        } catch (error) {
            showErrorToast("Failed to update employee status");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-slate-500 font-medium">Loading employee details...</p>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="p-4 bg-slate-50 rounded-full text-slate-400">
                    <Building className="h-12 w-12" />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Employee Not Found</h2>
                    <p className="text-slate-500">The employee you're looking for doesn't exist or has been removed.</p>
                </div>
                <Link href="/admin/employees">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Employees
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* HEADER ACTIONS */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-5">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-10 w-10 rounded-xl hover:bg-slate-100"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/10">
                            <AvatarImage src={employee.profilePicture} />
                            <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                                {employee.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-slate-900">{employee.name}</h1>
                                <Badge
                                    variant={employee.isBlocked ? "destructive" : "success"}
                                    className="px-2.5 py-0.5"
                                >
                                    {employee.isBlocked ? "Blocked" : "Active"}
                                </Badge>
                            </div>
                            <p className="text-slate-500 font-medium">{employee.position || "Employee"}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant={employee.isBlocked ? "default" : "outline"}
                        className={employee.isBlocked ? "bg-emerald-600 hover:bg-emerald-700 font-semibold" : "border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold"}
                        onClick={handleToggleBlock}
                        disabled={actionLoading}
                    >
                        {actionLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        ) : employee.isBlocked ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                        ) : (
                            <Ban className="h-4 w-4 mr-2" />
                        )}
                        {employee.isBlocked ? "Unblock Employee" : "Block Employee"}
                    </Button>

                    <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200">
                        <MoreVertical className="h-5 w-5 text-slate-500" />
                    </Button>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="grid gap-8 lg:grid-cols-3">

                {/* SIDEBAR INFO */}
                <div className="space-y-8 lg:col-span-1">
                    <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold text-slate-800">Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 group">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                                        <p className="text-sm font-semibold text-slate-700">{employee.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <Building className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Associated Company</label>
                                        <p className="text-sm font-semibold text-slate-700">{employee.companyName || "N/A"}</p>
                                        {employee.companyId && (
                                            <Link href={`/admin/companies/${employee.companyId}`} className="text-xs text-primary hover:underline">
                                                View Company
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Department</label>
                                        <p className="text-sm font-semibold text-slate-700">{employee.department || "General"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Registration Date</label>
                                        <p className="text-sm font-semibold text-slate-700">
                                            {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group border-t border-slate-100 pt-5 mt-5">
                                    <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Identity & Role</label>
                                        <p className="text-xs font-semibold text-slate-700">Corporate Learner (Employee)</p>
                                        <p className="text-[10px] text-slate-400">Verified by platform</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* MAIN FEED */}
                <div className="space-y-8 lg:col-span-2">

                    {/* STATS OVERVIEW */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                        <BookOpen className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Assigned Courses</p>
                                        <h3 className="text-2xl font-black text-slate-900">
                                            {/* We'll assume courses list exists in full object */}
                                            {(employee as any).coursesAssigned?.length || 0}
                                        </h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                        <CheckCircle className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Compliance Status</p>
                                        <h3 className="text-2xl font-black text-slate-900">
                                            {employee.isBlocked ? "Restricted" : "Active"}
                                        </h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ACTIVITY / COURSES (Placeholder or Real if available) */}
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">Assigned Learning Content</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {(employee as any).coursesAssigned?.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {(employee as any).coursesAssigned.map((courseId: string, idx: number) => (
                                        <div key={idx} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900">Course ID: {courseId}</h4>
                                                    <p className="text-xs text-slate-500">Corporate mandatory training</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-slate-400 border-slate-200">Enrolled</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center flex flex-col items-center gap-3">
                                    <div className="p-4 bg-slate-50 rounded-full text-slate-200">
                                        <BookOpen className="h-10 w-10" />
                                    </div>
                                    <div className="max-w-xs">
                                        <p className="font-semibold text-slate-900">No courses assigned yet</p>
                                        <p className="text-xs text-slate-500 mt-1">This employee hasn't been assigned any learning paths by their company.</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
