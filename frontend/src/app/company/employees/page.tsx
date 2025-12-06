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
        // Filter to show only approved employees
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
    if (tab !== "requests") {
      fetchEmployees();
    }
  }, [page, pageSize, debouncedInputValue, tab]);

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
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "US";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-24 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Employees</h1>
            <p className="text-muted-foreground">Manage your team and track growth</p>
          </div>

          <Button
            onClick={() => router.push("/company/addEmployee")}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Add Employee
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b pb-2">
          {([
            ["active", `Active (${activeCount})`],
            ["blocked", `Blocked (${blockedCount})`],
            ["requests", `Requests`],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-2 px-3 text-sm font-medium transition-all ${tab === key
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        {tab !== "requests" && (
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        )}

        {tab === "requests" ? (
          <EmployeeRequestsTab />
        ) : (
          <div className="border rounded-lg bg-card">
            {fetchLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : visibleEmployees.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No employees found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {["Name", "Email", "Position", "Department", "Actions"].map((h) => (
                        <th key={h} className="text-left px-6 py-3 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleEmployees.map((emp) => (
                      <tr key={emp._id} className="border-b hover:bg-muted/50 transition">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {getAvatar(emp.name)}
                            </div>
                            <span className="font-medium">{emp.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">{emp.email}</td>
                        <td className="px-6 py-3">{emp.position || "N/A"}</td>
                        <td className="px-6 py-3">{emp.department || "N/A"}</td>
                        <td className="px-6 py-3">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/company/employees/${emp._id}`)}
                            >
                              View
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleBlockEmployee(emp._id, emp.isBlocked || false)}
                              disabled={actionLoading === emp._id}
                            >
                              {actionLoading === emp._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : emp.isBlocked ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <Ban className="h-4 w-4 mr-1" />
                                  Block
                                </>
                              )}
                            </Button>

                            <ConfirmationDialog
                              title="Remove Employee"
                              description="Are you sure you want to remove this employee from your company? This action cannot be undone."
                              confirmText="Remove"
                              onConfirm={() => handleRemoveEmployee(emp._id)}
                              triggerButton={
                                <Button variant="destructive" size="sm" disabled={actionLoading === emp._id}>
                                  {actionLoading === emp._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <Trash className="w-4 h-4 mr-1" />
                                      Remove
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
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
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
  );
}
