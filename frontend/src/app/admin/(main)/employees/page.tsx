"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Eye,
    Ban,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { IAdminEmployee, IAdminEmployeeListResponse } from "@/types/admin/employee";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";

export default function EmployeeList() {
    const [employees, setEmployees] = useState<IAdminEmployee[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [search, setSearch] = useState<string>("");
    const [status, setStatus] = useState<"all" | "active" | "blocked">("all");

    const [page, setPage] = useState<number>(1);
    const limit = 10;

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response: IAdminEmployeeListResponse = await adminApiMethods.getEmployees({
                page,
                limit,
                search,
                status: status === "all" ? undefined : status,
            });

            setEmployees(response.data.data);
            setTotal(response.data.total);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
            showErrorToast("Failed to fetch employees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [page, search, status]);

    const handleToggleBlock = async (employee: IAdminEmployee) => {
        setActionLoading(employee._id);
        try {
            if (employee.isBlocked) {
                await adminApiMethods.unblockAdminEmployee(employee._id);
                showSuccessToast("Employee unblocked successfully");
            } else {
                await adminApiMethods.blockAdminEmployee(employee._id);
                showSuccessToast("Employee blocked successfully");
            }
            fetchEmployees();
        } catch (error) {
            showErrorToast("Failed to update employee status");
        } finally {
            setActionLoading(null);
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
                <p className="text-slate-500">
                    Monitor and manage employees across all registered companies.
                </p>
            </div>

            <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">

                        {/* SEARCH */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by name, email or company..."
                                className="pl-10 h-10 border-slate-200 focus:ring-primary"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* FILTER BUTTONS */}
                        <div className="flex items-center gap-3">
                            <div className="border border-slate-200 bg-slate-50 rounded-lg p-1 flex gap-1">
                                <Button
                                    variant={status === "all" ? "white" : "ghost"}
                                    size="sm"
                                    className={status === "all" ? "bg-white shadow-sm" : "text-slate-600"}
                                    onClick={() => setStatus("all")}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={status === "active" ? "white" : "ghost"}
                                    size="sm"
                                    className={status === "active" ? "bg-white shadow-sm" : "text-slate-600"}
                                    onClick={() => setStatus("active")}
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={status === "blocked" ? "white" : "ghost"}
                                    size="sm"
                                    className={status === "blocked" ? "bg-white shadow-sm" : "text-slate-600"}
                                    onClick={() => setStatus("blocked")}
                                >
                                    Blocked
                                </Button>
                            </div>

                            <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200">
                                <Filter className="h-4 w-4 text-slate-600" />
                            </Button>
                        </div>

                    </div>
                </CardHeader>

                {/* TABLE */}
                <CardContent>
                    <div className="rounded-md border border-slate-100 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-semibold text-slate-700">Employee</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Company</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Role & Dept</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Join Date</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                                <p className="text-sm text-slate-500">Loading employees...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : employees.length > 0 ? (
                                    employees.map((employee) => (
                                        <TableRow key={employee._id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border border-slate-100">
                                                        <AvatarImage src={employee.profilePicture} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                            {employee.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-900">{employee.name}</span>
                                                        <span className="text-xs text-slate-500 font-medium">
                                                            {employee.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-slate-600">
                                                    <Building className="h-3.5 w-3.5 opacity-60" />
                                                    <span className="text-sm font-medium">{employee.companyName || "N/A"}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-slate-700 font-medium">{employee.position || "N/A"}</span>
                                                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                                        <Briefcase className="h-3 w-3" /> {employee.department || "General"}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={employee.isBlocked ? "destructive" : "success"}
                                                    className="capitalize px-2.5 py-0.5"
                                                >
                                                    {employee.isBlocked ? "blocked" : "active"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-slate-600 text-sm">
                                                {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={`/admin/employees/${employee._id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={`h-8 w-8 transition-colors ${employee.isBlocked
                                                                ? "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                                                : "text-rose-400 hover:text-rose-500 hover:bg-rose-50"
                                                            }`}
                                                        disabled={actionLoading === employee._id}
                                                        onClick={() => handleToggleBlock(employee)}
                                                    >
                                                        {actionLoading === employee._id ? (
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                        ) : employee.isBlocked ? (
                                                            <CheckCircle className="h-4 w-4" />
                                                        ) : (
                                                            <Ban className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center p-12 text-slate-400"
                                        >
                                            <div className="flex flex-col items-center gap-2 opacity-50">
                                                <Building className="h-12 w-12 mb-2" />
                                                <p className="text-lg font-medium">No employees found</p>
                                                <p className="text-sm">Try adjusting your filters or search keywords.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center pt-6">
                            <p className="text-sm text-slate-500 font-medium">
                                Showing <span className="text-slate-900">{employees.length}</span> of <span className="text-slate-900">{total}</span> employees
                            </p>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 1}
                                    className="border-slate-200 text-slate-600 hover:bg-slate-50"
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                                </Button>

                                <div className="flex items-center gap-1">
                                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={page === pageNum ? "default" : "ghost"}
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => setPage(pageNum)}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === totalPages}
                                    className="border-slate-200 text-slate-600 hover:bg-slate-50"
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
