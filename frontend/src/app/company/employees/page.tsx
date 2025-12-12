"use client";

import { useEffect, useState, useMemo } from "react";
import { AxiosError } from "axios";
import Header from "@/components/company/Header";
import { useRouter } from "next/navigation";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import ConfirmationDialog from "@/reusable/ConfirmationDialog";
import { Trash, UserPlus, Loader2, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmployeeRequestsTab from "@/components/company/employee/EmployeeRequestsTab";

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

  const [tab, setTab] = useState<"active" | "blocked" | "requests">("active");

  const router = useRouter();

  const fetchEmployees = async () => {
    setFetchLoading(true);
    try {
      const res = await companyApiMethods.getAllEmployees({
        search: debouncedInputValue,
        page,
        limit: pageSize,
      });
      if (res?.data) {
        const approvedEmployees = (res.data.employees || []).filter(
          (emp: Employee) => emp.status === "approved" || !emp.status
        );
        setEmployees(approvedEmployees);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? (err.response?.data as any)?.message || err.message
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
      if ((res as any)?.ok) {
        showSuccessToast((res as any)?.message || `Employee ${!isBlocked ? "blocked" : "unblocked"}`);
        await fetchEmployees();
      }
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? (err.response?.data as any)?.message || err.message
          : "Failed to toggle block status";
      showErrorToast(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveEmployee = async (employeeId: string) => {
    setActionLoading(employeeId);
    try {
      const res = await companyApiMethods.removeEmployee(employeeId);
      if ((res as any)?.ok) {
        showSuccessToast("Employee removed from company");
        await fetchEmployees();
      }
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? (err.response?.data as any)?.message || err.message
          : "Failed to remove employee";
      showErrorToast(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (tab !== "requests") fetchEmployees();
  }, [page, debouncedInputValue, tab]);

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

  // ⭐ Background component
 const Background = () => (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/20 to-slate-900" />
      <div className="fixed inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="fixed w-px h-px bg-white/70 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>
    </>
  );

  return (
   <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/20 to-slate-900" />
      <div className="fixed inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="fixed w-px h-px bg-white/70 animate-pulse"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s` }}
          />
        ))}
      </div>


      <div className="relative z-20">
        <Header />

        <main className="max-w-7xl mx-auto px-6 py-28 space-y-12">

          {/* 🏷️ Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Employees</h1>
              <p className="text-gray-400">Manage your team & monitor activity</p>
            </div>

            <Button
              onClick={() => router.push("/company/addEmployee")}
              className="flex items-center gap-2 bg-primary hover:bg-primary/80 shadow-lg shadow-primary/20"
            >
              <UserPlus className="w-4 h-4" /> Add Employee
            </Button>
          </div>

          {/* ⭐ Tabs */}
          <div className="flex gap-8 border-b border-white/10 pb-3">
            {([
              ["active", `Active (${activeCount})`],
              ["blocked", `Blocked (${blockedCount})`],
              ["requests", `Requests`],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`pb-2 px-2 text-sm font-semibold tracking-wide transition-all ${
                  tab === key
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 🔍 Search Bar */}
          {tab !== "requests" && (
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm bg-white/5 border-white/10 text-white placeholder-gray-400"
            />
          )}

          {/* 🔄 Requests Tab */}
          {tab === "requests" ? (
            <EmployeeRequestsTab />
          ) : (
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">

              {/* Loading */}
              {fetchLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : visibleEmployees.length === 0 ? (
                <p className="text-center text-gray-400 py-12">No employees found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-white">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        {["Name", "Email", "Position", "Department", "Actions"].map((h) => (
                          <th key={h} className="text-left px-6 py-4 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleEmployees.map((emp) => (
                        <tr
                          key={emp._id}
                          className="border-b border-white/10 hover:bg-white/5 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary ring-2 ring-primary/30">
                                {getAvatar(emp.name)}
                              </div>
                              <span>{emp.name}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-gray-300">{emp.email}</td>
                          <td className="px-6 py-4 text-gray-300">{emp.position || "N/A"}</td>
                          <td className="px-6 py-4 text-gray-300">{emp.department || "N/A"}</td>

                          {/* ⭐ Action Buttons */}
                          <td className="px-6 py-4">
                            <div className="flex gap-2">

                              {/* View */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/company/employees/${emp._id}`)}
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                View
                              </Button>

                              {/* Block / Unblock */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleBlockEmployee(emp._id, emp.isBlocked || false)}
                                disabled={actionLoading === emp._id}
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                {actionLoading === emp._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : emp.isBlocked ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" /> Unblock
                                  </>
                                ) : (
                                  <>
                                    <Ban className="h-4 w-4 mr-1" /> Block
                                  </>
                                )}
                              </Button>

                              {/* Remove */}
                              <ConfirmationDialog
                                title="Remove Employee"
                                description="Are you sure you want to remove this employee? This action cannot be undone."
                                confirmText="Remove"
                                onConfirm={() => handleRemoveEmployee(emp._id)}
                                triggerButton={
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={actionLoading === emp._id}
                                  >
                                    {actionLoading === emp._id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <>
                                        <Trash className="w-4 h-4 mr-1" /> Remove
                                      </>
                                    )}
                                  </Button>
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-t border-white/10">
                  <span className="text-gray-300 text-sm">
                    Page {page} of {totalPages}
                  </span>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="border-white/20 text-white hover:bg-white/10"
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
 