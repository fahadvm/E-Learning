"use client";

import { useEffect, useState, useMemo } from "react";
import { AxiosError } from "axios";
import Header from "@/components/company/Header";
import { useRouter } from "next/navigation";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import ConfirmationDialog from "@/reusable/ConfirmationDialog";
import { Trash, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmployeeRequestsTab from "@/components/company/employee/EmployeeRequestsTab";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface Employee {
  _id: string;
  name: string;
  email: string;
  position?: string;
  department?: string;
  isBlocked?: boolean;
  status?: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");

  const [department, setDepartment] = useState<string>("all");
  const [position, setPosition] = useState<string>("all");

  const [tab, setTab] = useState<"active" | "blocked" | "requests">("active");

  const router = useRouter();

  const fetchEmployees = async () => {
    setFetchLoading(true);
    try {
      const res = await companyApiMethods.getAllEmployees({
        search: debouncedInputValue,
        page,
        limit: pageSize,
        department: department !== "all" ? department : undefined,
        position: position !== "all" ? position : undefined,
      });
      if (res?.data) {
        // The backend might return all employees, we filter based on status/isBlocked locally if needed,
        // but it's better if backend handles it. For now keeping local filter as per existing code.
        setEmployees(res.data.employees || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? (err.response?.data as { message: string })?.message || err.message
          : "Failed to fetch employees";
      showErrorToast(errorMessage);
    } finally {
      setFetchLoading(false);
    }
  };

  const toggleBlockEmployee = async (employeeId: string, isBlocked: boolean) => {
    setActionLoading(employeeId);
    try {
      const res = await companyApiMethods.blockEmployee(employeeId, { status: !isBlocked });
      if ((res as { ok: boolean }).ok) {
        showSuccessToast((res as { message: string }).message || `Employee ${!isBlocked ? "blocked" : "unblocked"}`);
        await fetchEmployees();
      }
    } catch {
      showErrorToast("Failed to toggle block status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveEmployee = async (employeeId: string) => {
    setActionLoading(employeeId);
    try {
      const res = await companyApiMethods.removeEmployee(employeeId);
      if ((res as { ok: boolean }).ok) {
        showSuccessToast("Employee removed from company");
        await fetchEmployees();
      }
    } catch {
      showErrorToast("Failed to remove employee");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (tab !== "requests") fetchEmployees();
  }, [page, debouncedInputValue, department, position, tab]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInputValue(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const visibleEmployees = useMemo(() => {
    if (tab === "active") return employees.filter((e) => !e.isBlocked);
    if (tab === "blocked") return employees.filter((e) => !!e.isBlocked);
    return [];
  }, [employees, tab]);

  const activeCount = employees.filter((e) => !e.isBlocked).length;
  const blockedCount = employees.filter((e) => !!e.isBlocked).length;

  const getAvatar = (name: string) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const resetFilters = () => {
    setSearchQuery("");
    setDepartment("all");
    setPosition("all");
    setPage(1);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/10 to-slate-900" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="relative z-20">
        <Header />

        <main className="max-w-7xl mx-auto px-6 py-28 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Employee Directory</h1>
              <p className="text-gray-400 mt-2">Oversee your workforce, roles, and status.</p>
            </div>

            <Button
              onClick={() => router.push("/company/addEmployee")}
              className="bg-primary hover:bg-primary/90 text-white px-6 h-12 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-5 h-5 mr-2" /> Add New Employee
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-8 border-b border-white/10">
            {([
              ["active", `Active Members`, activeCount],
              ["blocked", `Blocked`, blockedCount],
              ["requests", `Join Requests`, null],
            ] as const).map(([key, label, count]) => (
              <button
                key={key}
                onClick={() => { setTab(key); setPage(1); }}
                className={`pb-4 px-2 text-sm font-medium transition-all relative ${tab === key ? "text-primary" : "text-gray-400 hover:text-white"
                  }`}
              >
                {label} {count !== null && <span className="ml-2 opacity-60 text-xs font-normal">({count})</span>}
                {tab === key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                )}
              </button>
            ))}
          </div>

          {/* Filters Section */}
          {tab !== "requests" && (
            <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="relative flex-1 min-w-[240px]">
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border-white/10 pl-10 h-10 rounded-xl placeholder:text-gray-500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Filter className="w-4 h-4" />
                </div>
              </div>

              <div className="w-[180px]">
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-10 rounded-xl">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[180px]">
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-10 rounded-xl">
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery || department !== "all" || position !== "all") && (
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                  className="text-gray-400 hover:text-white hover:bg-white/5 h-10"
                >
                  <X className="w-4 h-4 mr-2" /> Reset
                </Button>
              )}
            </div>
          )}

          {/* Table / Content Section */}
          {tab === "requests" ? (
            <EmployeeRequestsTab />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-300">Employee</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-300">Department</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-300">Position</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {fetchLoading ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                        </td>
                      </tr>
                    ) : visibleEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <div className="flex flex-col items-center gap-2 opacity-50">
                            <UserPlus className="w-12 h-12 mb-2" />
                            <p className="text-lg font-medium">No employees found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      visibleEmployees.map((emp) => (
                        <tr
                          key={emp._id}
                          className="group hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
                                {getAvatar(emp.name)}
                              </div>
                              <div>
                                <p className="font-medium text-white group-hover:text-primary transition-colors">{emp.name}</p>
                                <p className="text-xs text-gray-500">{emp.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="bg-white/5 border-white/10 font-normal">
                              {emp.department || "N/A"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-300">
                              {emp.position || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {emp.isBlocked ? (
                              <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-2 py-0.5 rounded-md flex items-center gap-1.5 w-fit">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Blocked
                              </Badge>
                            ) : (
                              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-2 py-0.5 rounded-md flex items-center gap-1.5 w-fit">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/company/employees/${emp._id}`)}
                                className="h-8 hover:bg-primary/20 hover:text-primary"
                              >
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleBlockEmployee(emp._id, emp.isBlocked || false)}
                                disabled={actionLoading === emp._id}
                                className="h-8 hover:bg-yellow-500/10 hover:text-yellow-500"
                              >
                                {actionLoading === emp._id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : emp.isBlocked ? "Unblock" : "Block"}
                              </Button>
                              <ConfirmationDialog
                                title="Remove Employee"
                                description="Permanently remove this employee? They will lose access to all company courses."
                                confirmText="Remove"
                                onConfirm={() => handleRemoveEmployee(emp._id)}
                                triggerButton={
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={actionLoading === emp._id}
                                    className="h-8 text-red-400/70 hover:text-red-500 hover:bg-red-500/10"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing <span className="text-white font-medium">{visibleEmployees.length}</span> of <span className="text-white font-medium">{pageSize * totalPages}</span> employees
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="border-white/10 bg-white/5 hover:bg-white/10"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="border-white/10 bg-white/5 hover:bg-white/10"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
