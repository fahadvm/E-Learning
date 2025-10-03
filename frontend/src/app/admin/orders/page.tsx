"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/admin/sidebar";
import { adminApiMethods } from "@/services/APImethods/adminAPImethods";

type CompanyOrder = {
    _id: string;
    companyId: { email: string; name: string; _id: string };
    courses: { title: string; _id: string }[];
    amount: number;
    createdAt: string;
};

type StudentOrder = {
    _id: string;
    studentId: { name: string; email: string; _id: string };
    courses: { title: string; _id: string }[];
    amount: number;
    createdAt: string;
};

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState<"company" | "student">("company");
    const [companyOrders, setCompanyOrders] = useState<CompanyOrder[]>([]);
    const [studentOrders, setStudentOrders] = useState<StudentOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
        setPage(1); // reset page when switching tabs
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            if (activeTab === "company") {
                const res = await adminApiMethods.getCompanyOrders();
                setCompanyOrders(res.data || []);
            } else {
                const res = await adminApiMethods.getStudentOrders();
                setStudentOrders(res.data || []);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const getPaginatedData = <T,>(data: T[]): T[] => {
        const start = (page - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    };

    const totalPages =
        activeTab === "company"
            ? Math.ceil(companyOrders.length / itemsPerPage)
            : Math.ceil(studentOrders.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 overflow-x-hidden relative">
            {/* Mobile Hamburger */}
            <button
                className="absolute top-4 left-4 z-50 lg:hidden p-2 bg-gray-900 text-white rounded-md"
                onClick={() => setSidebarOpen(true)}
            >
                <Menu size={24} />
            </button>

            {/* Sidebar for desktop */}
            <div className="hidden lg:block w-64 h-screen sticky top-0">
                <AdminSidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="w-64 h-full bg-gray-900 text-white p-6 shadow-lg">
                        <div className="flex justify-end mb-4">
                            <button onClick={() => setSidebarOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <AdminSidebar />
                    </div>
                    <div
                        className="flex-1 bg-black/50"
                        onClick={() => setSidebarOpen(false)}
                    />
                </div>
            )}

            {/* Page Content */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

                {/* Tabs */}
                <div className="flex space-x-4 border-b mb-6">
                    <button
                        onClick={() => setActiveTab("company")}
                        className={`px-4 py-2 font-medium border-b-2 ${activeTab === "company"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-600 hover:text-blue-600"
                            }`}
                    >
                        Company Purchased
                    </button>
                    <button
                        onClick={() => setActiveTab("student")}
                        className={`px-4 py-2 font-medium border-b-2 ${activeTab === "student"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-600 hover:text-blue-600"
                            }`}
                    >
                        Student Purchased
                    </button>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow p-4">
                    {loading ? (
                        <p>Loading orders...</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="p-3">Order ID</th>
                                            <th className="p-3">{activeTab === "company" ? "Company" : "Student"}</th>
                                            <th className="p-3">Course</th>
                                            <th className="p-3">Amount</th>
                                            <th className="p-3">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeTab === "company"
                                            ? getPaginatedData(companyOrders).map((order) => (
                                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                                    <td className="p-3">{order._id}</td>
                                                    <td className="p-3">{order.companyId.name}</td>
                                                    <td className="p-3">
                                                        {order.courses.map((c, i) => (
                                                            <span key={c._id}>
                                                                {c.title}
                                                                {i < order.courses.length - 1 && ", "}
                                                            </span>
                                                        ))}
                                                    </td>
                                                    <td className="p-3">₹{order.amount}</td>
                                                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                            : getPaginatedData(studentOrders).map((order) => (
                                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                                    <td className="p-3">{order._id}</td>
                                                    <td className="p-3">{order.studentId?.name || "N/A"}</td>
                                                    <td className="p-3">
                                                        {order.courses.map((c, i) => (
                                                            <span key={c._id}>
                                                                {c.title}
                                                                {i < order.courses.length - 1 && ", "}
                                                            </span>
                                                        ))}
                                                    </td>
                                                    <td className="p-3">₹{order.amount}</td>
                                                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                    </tbody>

                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-4 space-x-2">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    <span className="px-3 py-1">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
