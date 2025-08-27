"use client";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Header from "@/componentssss/company/Header";
import { useRouter } from "next/navigation";
import { companyApiMethods } from "@/services/APImethods/companyAPImethods";
import { showSuccessToast } from "@/utils/Toast";
import { useCompany } from "@/context/companyContext";
import ConfirmationDialog from "@/reusable/ConfirmationDialog";

interface Employee {
    _id: string;
    name: string;
    email: string;
    position?: string;
    isBlocked?: boolean;
}

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [position, setPosition] = useState("");
    const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; position?: string }>({});
    const [fetchLoading, setFetchLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPosition, setEditPosition] = useState("");
    const [editFormErrors, setEditFormErrors] = useState<{ name?: string; email?: string; position?: string }>({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const { company } = useCompany();
    const router = useRouter();

    //  validate form
    const validateForm = (formData: { name: string; email: string; position: string }) => {
        const errors: { name?: string; email?: string; position?: string } = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        else if (formData.name.length < 2) errors.name = "Name must be at least 2 characters";

        if (!formData.email.trim()) errors.email = "Email is required";
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))
            errors.email = "Invalid email format";

        if (formData.position && formData.position.length > 50)
            errors.position = "Position cannot exceed 50 characters";

        return errors;
    };

    //  fetch employees with pagination, search, sort
    const fetchEmployees = async () => {
        setFetchLoading(true);
        setError(null);
        try {
            const res = await companyApiMethods.getAllEmployees({
                search: searchQuery,
                page,
                limit: pageSize,
            });
            if (res.data) {
                setEmployees(res.data.employees);
                setTotalPages(res.data.totalPages || 1);
            } else {
                throw new Error("Unexpected API response format");
            }
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError
                    ? `Failed to fetch employees: ${err.response?.status} - ${err.response?.data?.message || err.message}`
                    : "Failed to fetch employees";
            setError(errorMessage);
        } finally {
            setFetchLoading(false);
        }
    };

    //  Add employee
    const addEmployee = async () => {
        const errors = validateForm({ name, email, position });
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setAddLoading(true);
        setError(null);
        try {
            const res = await companyApiMethods.addEmployee({
                name,
                email,
                position: position.trim() || undefined,
                companyId: company?._id,
            });
            if (res.ok) {
                showSuccessToast(res.message)
                setName("");
                setEmail("");
                setPosition("");
                setFormErrors({});
                await fetchEmployees();
                setIsAddEmployeeModalOpen(false);
            }
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError ? err.response?.data?.message || err.message : "Failed to add employee";
            setError(errorMessage);
        } finally {
            setAddLoading(false);
        }
    };

    //  Edit employee
    const editEmployee = async (employeeId: string) => {
        const errors = validateForm({ name: editName, email: editEmail, position: editPosition });
        setEditFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setActionLoading(true);
        setError(null);
        try {
            await companyApiMethods.updateEmployee(employeeId, {
                name: editName,
                email: editEmail,
                position: editPosition.trim() || undefined,
            });
            setIsEditModalOpen(false);
            setEditFormErrors({});
            await fetchEmployees();
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError ? err.response?.data?.message || err.message : "Failed to update employee";
            setError(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    //  Block/unblock employee
    const toggleBlockEmployee = async (employeeId: string, isBlocked: boolean) => {
        setActionLoading(true);
        setError(null);
        try {
            const res = await companyApiMethods.blockEmployee(employeeId, { status: !isBlocked });
            if (res.ok) {
                showSuccessToast(res.message)
            }
            await fetchEmployees();
        } catch (err) {
            const errorMessage =
                err instanceof AxiosError ? err.response?.data?.message || err.message : "Failed to toggle block status";
            setError(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    //  Open edit modal
    const openEditModal = (employee: Employee) => {
        setSelectedEmployee(employee);
        setEditName(employee.name);
        setEditEmail(employee.email);
        setEditPosition(employee.position || "");
        setEditFormErrors({});
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        fetchEmployees();
    }, [page, pageSize, searchQuery,]);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-900">Manage Employees</h2>
                            <button
                                onClick={() => setIsAddEmployeeModalOpen(true)}
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                aria-label="Add new employee"
                            >
                                + Add Employee
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow" role="alert">
                                {error}
                            </div>
                        )}

                        {/* Filter and Sort */}
                        <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Filter & Sort</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search by name or email"
                                        className="w-full rounded-md border border-gray-300 p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setPage(1);
                                        }}
                                        aria-label="Search employees"
                                    />
                                </div>


                            </div>
                        </div>

                        {/* Employee List */}
                        {fetchLoading ? (
                            <div className="text-gray-600 text-center py-8">Loading employees...</div>
                        ) : employees.length === 0 ? (
                            <div className="text-gray-600 text-center py-8">No employees found.</div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                                <table className="w-full text-gray-800" aria-label="Employee list">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left p-4 font-semibold">Name</th>
                                            <th className="text-left p-4 font-semibold">Email</th>
                                            <th className="text-left p-4 font-semibold">Position</th>
                                            <th className="text-left p-4 font-semibold">Status</th>
                                            <th className="text-left p-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((emp, index) => (
                                            <tr key={emp._id} className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}>
                                                <td className="p-4">{emp.name}</td>
                                                <td className="p-4">{emp.email}</td>
                                                <td className="p-4">{emp.position || "N/A"}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-sm ${emp.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                                        {emp.isBlocked ? "Blocked" : "Active"}
                                                    </span>
                                                </td>
                                                <td className="p-4 space-x-3">
                                                    <span className="group relative">
                                                        <button
                                                            onClick={() => router.push(`/company/employees/${emp._id}`)}
                                                            className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                                                            aria-label={`View details for ${emp.name}`}
                                                        >
                                                            Details
                                                        </button>
                                                        <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                                                            View Details
                                                        </span>
                                                    </span>
                                                    {/* <span className="group relative">
                                                        <button
                                                            onClick={() => openEditModal(emp)}
                                                            className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                                                            aria-label={`Edit ${emp.name}`}
                                                        >
                                                            Edit
                                                        </button>
                                                        <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                                                            Edit Employee
                                                        </span>
                                                    </span> */}
                                                    <span className="group relative">





                                                        <ConfirmationDialog
                                                            title={emp.isBlocked ? "Unblock Employee" : "Block Employee"}
                                                            description={
                                                                emp.isBlocked
                                                                    ? "Are you sure you want to unblock this Employee?"
                                                                    : "Are you sure you want to block this Employee?"
                                                            }
                                                            confirmText={emp.isBlocked ? "Unblock" : "Block"}
                                                            onConfirm={() => toggleBlockEmployee(emp._id, emp.isBlocked || false)}
                                                            triggerButton={
                                                                <button
                                                                    className={`${emp.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white py-1 px-3 rounded-lg transition-colors`}
                                                                    aria-label={emp.isBlocked ? `Unblock ${emp.name}` : `Block ${emp.name}`}
                                                                >
                                                                    {emp.isBlocked ? "Unblock" : "Block"}
                                                                </button>
                                                            }
                                                        />
                                                        
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Pagination */}
                                <div className="p-4 flex justify-between items-center flex-wrap">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-gray-700">Rows per page:</label>
                                        <select
                                            value={pageSize}
                                            onChange={(e) => {
                                                setPageSize(Number(e.target.value));
                                                setPage(1);
                                            }}
                                            className="border rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
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
                                            className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
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
                                                    <span key={`gap-${i}`} className="px-2 text-gray-500">
                                                        ...
                                                    </span>
                                                ) : (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPage(p)}
                                                        className={`px-3 py-1.5 rounded-md border ${p === page ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-700 hover:bg-blue-50"}`}
                                                        aria-label={`Page ${p}`}
                                                    >
                                                        {p}
                                                    </button>
                                                );
                                            })}
                                        <button
                                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={page === totalPages}
                                            className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                            aria-label="Next page"
                                        >
                                            Next ›
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Add Employee Modal */}
                        {isAddEmployeeModalOpen && (
                            <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 animate-fade-in">
                                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Add Employee</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                className={`w-full rounded-md border ${formErrors.name ? "border-red-500" : "border-gray-300"} p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                aria-label="Employee name"
                                                disabled={addLoading}
                                            />
                                            {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                className={`w-full rounded-md border ${formErrors.email ? "border-red-500" : "border-gray-300"} p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                aria-label="Employee email"
                                                disabled={addLoading}
                                            />
                                            {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <input
                                                type="text"
                                                placeholder="Position (optional)"
                                                className={`w-full rounded-md border ${formErrors.position ? "border-red-500" : "border-gray-300"} p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                value={position}
                                                onChange={(e) => setPosition(e.target.value)}
                                                aria-label="Employee position"
                                                disabled={addLoading}
                                            />
                                            {formErrors.position && <p className="mt-1 text-sm text-red-500">{formErrors.position}</p>}
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={addEmployee}
                                                className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                                                disabled={addLoading}
                                                aria-label="Add employee"
                                            >
                                                {addLoading ? "Adding..." : "Add Employee"}
                                            </button>
                                            <button
                                                onClick={() => setIsAddEmployeeModalOpen(false)}
                                                className="w-full bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                                                aria-label="Cancel add employee"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Modal */}
                        {isEditModalOpen && selectedEmployee && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Employee</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                className={`w-full rounded-md border ${editFormErrors.name ? "border-red-500" : "border-gray-300"} p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                aria-label="Edit employee name"
                                                disabled={actionLoading}
                                            />
                                            {editFormErrors.name && <p className="mt-1 text-sm text-red-500">{editFormErrors.name}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                className={`w-full rounded-md border ${editFormErrors.email ? "border-red-500" : "border-gray-300"} p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                value={editEmail}
                                                onChange={(e) => setEditEmail(e.target.value)}
                                                aria-label="Edit employee email"
                                                disabled={actionLoading}
                                            />
                                            {editFormErrors.email && <p className="mt-1 text-sm text-red-500">{editFormErrors.email}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Position (optional)"
                                                className={`w-full rounded-md border ${editFormErrors.position ? "border-red-500" : "border-gray-300"} p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                value={editPosition}
                                                onChange={(e) => setEditPosition(e.target.value)}
                                                aria-label="Edit employee position"
                                                disabled={actionLoading}
                                            />
                                            {editFormErrors.position && <p className="mt-1 text-sm text-red-500">{editFormErrors.position}</p>}
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => editEmployee(selectedEmployee._id)}
                                                className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                                                disabled={actionLoading}
                                                aria-label="Save employee changes"
                                            >
                                                {actionLoading ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                onClick={() => setIsEditModalOpen(false)}
                                                className="w-full bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                                                aria-label="Cancel edit"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}