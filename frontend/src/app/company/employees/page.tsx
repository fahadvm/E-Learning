// Updated EmployeesPage styled to match galaxy neon theme
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
import EmployeeRequestsTab from "@/components/company/employee/EmployeeRequestsTab";

interface Employee {
  _id: string;
  name: string;
  email: string;
  position?: string;
  isBlocked?: boolean;
}

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

  const [tab, setTab] = useState("all" as "all" | "pending" | "requests");

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
        setEmployees(res.data.employees || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? (err.response?.data as any)?.message || err.message
          : "Failed to fetch employees";
      setError(errorMessage);
    } finally {
      setFetchLoading(false);
    }
  };

  const toggleBlockEmployee = async (employeeId: string, isBlocked: boolean) => {
    setActionLoading(true);
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

  useEffect(() => {
    fetchEmployees();
  }, [page, pageSize, debouncedInputValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInputValue(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const visibleEmployees = useMemo(() => {
    if (tab === "all") return employees.filter((e) => !e.isBlocked);
    if (tab === "pending") return employees.filter((e) => !!e.isBlocked);
    return [];
  }, [employees, tab]);

  const activeCount = employees.filter((e) => !e.isBlocked).length;
  const pendingCount = employees.filter((e) => !!e.isBlocked).length;

  const getAvatar = (name: string) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "US";

  return (
    <div className="galaxy-bg min-h-screen relative overflow-hidden">
      <div className="floating-stars"></div>
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-accent to-primary bg-clip-text text-transparent">
              Employees
            </h1>
            <p className="text-white/70">Manage your team and track growth</p>
          </div>

          <Button
            onClick={() => router.push("/company/addEmployee")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2 shadow-lg shadow-accent/30"
          >
            <UserPlus className="w-4 h-4" /> Add Employee
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-accent/20 pb-2">
          {([
            ["all", `Active (${activeCount})`],
            ["pending", `Invitations (${pendingCount})`],
            ["requests", `Requests (${pendingCount})`],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-2 px-3 text-sm font-medium transition-all ${
                tab === key
                  ? "text-accent border-b-2 border-accent"
                  : "text-white/70 hover:text-white"
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
            className="max-w-sm bg-black/40 border-accent/20 text-accent-foreground placeholder:text-white/70"
          />
        )}

        {tab === "requests" ? (
          <EmployeeRequestsTab />
        ) : (
          <div className="glow-border rounded-xl bg-black/40 backdrop-blur-sm p-6">
            {fetchLoading ? (
              <p className="text-center text-white/70 py-10">Loading...</p>
            ) : visibleEmployees.length === 0 ? (
              <p className="text-center text-white/70 py-10">No employees found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black/30">
                    <tr>
                      {["Name", "Department", "Role", "Courses", "Completion", "Actions"].map((h) => (
                        <th key={h} className="text-left px-6 py-3 font-semibold text-accent/90">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleEmployees.map((emp) => (
                      <tr key={emp._id} className="border-b border-accent/10 hover:bg-black/30 transition">
                        <td className="px-6 py-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                            {getAvatar(emp.name)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{emp.name}</p>
                            <p className="text-xs text-white/70">{emp.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-white">Not Assigned</td>
                        <td className="px-6 py-3 text-white">{emp.position || "N/A"}</td>
                        <td className="px-6 py-3 text-white">0</td>
                        <td className="px-6 py-3 flex items-center gap-2">
                          <div className="w-20 h-2 bg-black/30 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-accent to-primary" style={{ width: `0%` }} />
                          </div>
                          <span className="text-xs text-accent">0%</span>
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <Button
                            variant="ghost"
                            className="text-accent hover:text-accent/80"
                            onClick={() => router.push(`/company/employees/${emp._id}`)}
                          >
                            View
                          </Button>

                          <ConfirmationDialog
                            title="Remove Employee"
                            description="Are you sure you want to remove this employee?"
                            confirmText="Remove"
                            onConfirm={() => toggleBlockEmployee(emp._id, false)}
                            triggerButton={
                              <Button className="bg-red-600 hover:bg-red-700 text-white p-2">
                                <Trash className="w-4 h-4" />
                              </Button>
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
