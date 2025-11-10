"use client";

import { useEffect, useState, useMemo } from "react";
import { AxiosError } from "axios";
import Header from "@/components/company/Header";
import { useRouter } from "next/navigation";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showSuccessToast } from "@/utils/Toast";
import { useCompany } from "@/context/companyContext";
import ConfirmationDialog from "@/reusable/ConfirmationDialog";
import { Trash, UserPlus } from "lucide-react";



import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import EmployeeRequestsTab from "@/components/company/employee/EmployeeRequestsTab";


interface Employee {
    _id: string;
    name: string;
    email: string;
    position?: string;
    isBlocked?: boolean;
}

type TabKey = "all" | "pending" | "requests";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedInputValue, setDebouncedInputValue] = useState("");

    const [tab, setTab] = useState<TabKey>("all");

    const { company } = useCompany();
    const router = useRouter();

    // ===== API: fetch employees with pagination + server-side search =====
    const fetchEmployees = async () => {
        setFetchLoading(true);
        setError(null);
        try {
            const res = await companyApiMethods.getAllEmployees({
                search: debouncedInputValue,
                page,
                limit: pageSize,
            });

            if (res?.data) {
                setEmployees(res.data.employees || []);
                setTotalPages(res.data.totalPages || 1);
            } else {
                throw new Error("Unexpected API response format");
            }
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError
                    ? `Failed to fetch employees: ${err.response?.status} - ${(err.response?.data as any)?.message || err.message
                    }`
                    : "Failed to fetch employees";
            setError(errorMessage);
        } finally {
            setFetchLoading(false);
        }
    };

    // ===== API: block/unblock =====
    const toggleBlockEmployee = async (employeeId: string, isBlocked: boolean) => {
        setActionLoading(true);
        setError(null);
        try {
            const res = await companyApiMethods.blockEmployee(employeeId, { status: !isBlocked });
            if ((res as any)?.ok) showSuccessToast((res as any)?.message);
            await fetchEmployees();
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError
                    ? (err.response?.data as any)?.message || err.message
                    : "Failed to toggle block status";
            setError(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        fetchEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, debouncedInputValue]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedInputValue(searchQuery.trim());
            setPage(1); // reset to page 1 on new search
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // ===== Derived UI helpers =====
    const getStatusLabel = (emp: Employee) => (emp.isBlocked ? "pending" : "active");
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 border-green-300";
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    // Placeholder helpers (choice Y)
    const getAvatar = (name: string) =>
        name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "US";

    // Client-side filter for tabs (server search already applied)
    const visibleEmployees = useMemo(() => {
        if (tab === "all") return employees.filter((e) => !e.isBlocked);
        if (tab === "pending") return employees.filter((e) => !!e.isBlocked);
        return []; // "requests" tab doesn't show this table
    }, [employees, tab]);

    const activeCount = employees.filter((e) => !e.isBlocked).length;
    const pendingCount = employees.filter((e) => !!e.isBlocked).length;

    return (
        <>
            <Header />
            <div className="flex min-h-screen bg-background pt-20">
                <main className="flex-1 overflow-y-auto">
                    <div className="p-8 space-y-8 max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Employees</h1>
                                <p className="text-muted-foreground">
                                    Manage your workforce and track learning progress
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => router.push("/company/addEmployee")}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                                >
                                    <UserPlus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-4 border-b border-border">
                            <button
                                onClick={() => setTab("all")}
                                className={`pb-3 px-4 font-medium border-b-2 transition ${tab === "all"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Active ({activeCount})
                            </button>
                            <button
                                onClick={() => setTab("pending")}
                                className={`pb-3 px-4 font-medium border-b-2 transition ${tab === "pending"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Invitations ({pendingCount})
                            </button>
                            <button
                                onClick={() => setTab("requests")}
                                className={`pb-3 px-4 font-medium border-b-2 transition ${tab === "requests"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Requests ({pendingCount})
                            </button>
                        </div>

                        {/* Search */}
                        {tab !== "requests" && (
                            <div className="max-w-sm">
                                <Input
                                    placeholder="Search employees..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-input border-border"
                                    aria-label="Search employees"
                                />
                            </div>
                        )}

                        {/* Alerts */}
                        {error && (
                            <div
                                className="p-4 rounded-md bg-red-100 text-red-800 border border-red-200"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        {/* Employees Table */}
                        {tab !== "requests" && (
                            <>
                                {fetchLoading ? (
                                    <div className="text-muted-foreground text-center py-12">
                                        Loading employees...
                                    </div>
                                ) : visibleEmployees.length === 0 ? (
                                    <div className="text-muted-foreground text-center py-12">
                                        No employees found.
                                    </div>
                                ) : (
                                    <div className="border border-border rounded-lg overflow-hidden bg-card">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-muted/50 border-b border-border">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                                                            Department
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Courses</th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                                                            Completion
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {visibleEmployees.map((emp) => {
                                                        const status = getStatusLabel(emp); // active or pending
                                                        return (
                                                            <tr
                                                                key={emp._id}
                                                                className="border-b border-border hover:bg-muted/20 transition"
                                                            >
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                                                            {getAvatar(emp.name)}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-foreground">{emp.name}</p>
                                                                            <p className="text-xs text-muted-foreground">{emp.email}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                {/* Placeholders per choice Y */}
                                                                <td className="px-6 py-4 text-foreground">Not Assigned</td>
                                                                <td className="px-6 py-4 text-foreground">{emp.position || "N/A"}</td>
                                                                <td className="px-6 py-4 text-foreground">0</td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                                                            <div
                                                                                className="h-full bg-gradient-to-r from-primary to-accent"
                                                                                style={{ width: `0%` }}
                                                                            ></div>
                                                                        </div>
                                                                        <span className="text-xs font-medium text-foreground">0%</span>
                                                                    </div>
                                                                </td>



                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            className="text-primary hover:text-primary/80 px-2"
                                                                            onClick={() => router.push(`/company/employees/${emp._id}`)}
                                                                            aria-label={`View details for ${emp.name}`}
                                                                        >
                                                                            View
                                                                        </Button>

                                                                        <ConfirmationDialog
                                                                            title="Remove Employee"
                                                                            description="Are you sure you want to remove this employee from your organization? This action cannot be undone."
                                                                            confirmText="Remove"
                                                                            onConfirm={() => toggleBlockEmployee(emp._id, false)}
                                                                            triggerButton={
                                                                                <button
                                                                                    disabled={actionLoading}
                                                                                    className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                                                                                    aria-label={`Remove ${emp.name}`}
                                                                                >
                                                                                    <Trash className="w-4 h-4" />
                                                                                </button>
                                                                            }
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        <div className="p-4 flex justify-between items-center flex-wrap gap-3">
                                            <div className="flex items-center gap-2">
                                                <label className="text-foreground/80">Rows per page:</label>
                                                <select
                                                    value={pageSize}
                                                    onChange={(e) => {
                                                        setPageSize(Number(e.target.value));
                                                        setPage(1);
                                                    }}
                                                    className="border rounded-md p-2 bg-background text-foreground focus:ring-2 focus:ring-primary"
                                                    aria-label="Select page size"
                                                >
                                                    {[5, 10, 20, 50].map((size) => (
                                                        <option key={size} value={size}>
                                                            {size}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                                    disabled={page === 1}
                                                    className="px-3 py-1.5 rounded-md border border-border text-foreground/80 hover:bg-muted disabled:opacity-50"
                                                    aria-label="Previous page"
                                                >
                                                    ‹ Prev
                                                </button>

                                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                                                    .map((p, i, arr) => {
                                                        const prev = arr[i - 1];
                                                        const isGap = prev && p - prev > 1;
                                                        return isGap ? (
                                                            <span key={`gap-${i}`} className="px-2 text-muted-foreground">
                                                                ...
                                                            </span>
                                                        ) : (
                                                            <button
                                                                key={p}
                                                                onClick={() => setPage(p)}
                                                                className={`px-3 py-1.5 rounded-md border ${p === page
                                                                    ? "bg-primary text-primary-foreground border-primary"
                                                                    : "border-border text-foreground/80 hover:bg-muted"
                                                                    }`}
                                                                aria-label={`Page ${p}`}
                                                            >
                                                                {p}
                                                            </button>
                                                        );
                                                    })}

                                                <button
                                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                                    disabled={page === totalPages}
                                                    className="px-3 py-1.5 rounded-md border border-border text-foreground/80 hover:bg-muted disabled:opacity-50"
                                                    aria-label="Next page"
                                                >
                                                    Next ›
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Requests Tab Content */}
                        {tab === "requests" && (
                            <EmployeeRequestsTab />
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
