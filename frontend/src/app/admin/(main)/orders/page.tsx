"use client";
import { useEffect, useState } from "react";
import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { CompanyOrderResponse, PurchasedCourse } from "@/types/admin/adminTypes";

// Updated CompanyOrder type to include the mapped 'courses' field
type CompanyOrder = {
    _id: string;
    companyId: { email: string; name: string; _id: string };
    purchasedCourses: {
        courseId: { title: string; _id: string };
        seats: number;
        price: number;
    }[];
    amount: number;
    createdAt: string;
    // Add the mapped courses for frontend use
    courses: { title: string; _id: string; seats: number }[];
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
    const itemsPerPage = 8;

    useEffect(() => {
        fetchOrders();
        setPage(1);
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            if (activeTab === "company") {
                const res = await adminApiMethods.getCompanyOrders();
                const mapped: CompanyOrder[] = (res?.data || []).map((order: CompanyOrderResponse) => ({
                    ...order,
                    courses: order.purchasedCourses.map((c: PurchasedCourse) => ({
                        title: c.courseId?.title || "Unknown Course",
                        _id: c.courseId?._id || "",
                        seats: c.seats || 0
                    }))
                }));
                setCompanyOrders(mapped);
            } else {
                const res = await adminApiMethods.getStudentOrders();
                setStudentOrders(res?.data || []);
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
    const formatOrderId = (id: string) => `ord_${id.slice(0, 6)}`;


    return (
        <div className="flex min-h-screen bg-gray-50 p-6">
            <div className="flex-1">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Orders Management</h1>

                {/* Tabs */}
                <div className="flex space-x-4 border-b mb-6">
                    <button
                        onClick={() => setActiveTab("company")}
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "company"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-600 hover:text-blue-600"
                            }`}
                    >
                        Company Purchased
                    </button>
                    <button
                        onClick={() => setActiveTab("student")}
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "student"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-600 hover:text-blue-600"
                            }`}
                    >
                        Student Purchased
                    </button>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {loading ? (
                        <p className="text-center text-gray-500 py-12">Loading orders...</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                            <th className="p-4">Order ID</th>
                                            <th className="p-4">{activeTab === "company" ? "Company" : "Student"}</th>
                                            <th className="p-4">Courses</th>
                                            <th className="p-4">Amount</th>
                                            <th className="p-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeTab === "company" ? (
                                            getPaginatedData(companyOrders).map((order) => (
                                                <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                                                    <td className="p-4 font-mono text-xs">{formatOrderId(order._id)}</td>
                                                    <td className="p-4">
                                                        <div>
                                                            <p className="font-medium">{order.companyId.name}</p>
                                                            <p className="text-xs text-gray-500">{order.companyId.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {order.courses.map((course, index) => (
                                                            <span key={course._id}>
                                                                <span className="font-medium">{course.title}</span>
                                                                <span className="text-xs text-gray-500 ml-1">(Seats: {course.seats})</span>
                                                                {index < order.courses.length - 1 && <span className="text-gray-400">, </span>}
                                                            </span>
                                                        ))}
                                                    </td>
                                                    <td className="p-4 font-semibold text-green-600">₹{order.amount.toLocaleString()}</td>
                                                    <td className="p-4 text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            getPaginatedData(studentOrders).map((order) => (
                                                <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                                                    <td className="p-4 font-mono text-xs">{formatOrderId(order._id)}</td>
                                                    <td className="p-4">
                                                        <div>
                                                            <p className="font-medium">{order.studentId?.name || "N/A"}</p>
                                                            <p className="text-xs text-gray-500">{order.studentId?.email || "N/A"}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {order.courses.map((course, index) => (
                                                            <span key={course._id}>
                                                                {course.title}
                                                                {index < order.courses.length - 1 && <span className="text-gray-400">, </span>}
                                                            </span>
                                                        ))}
                                                    </td>
                                                    <td className="p-4 font-semibold text-green-600">₹{order.amount.toLocaleString()}</td>
                                                    <td className="p-4 text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 py-6 bg-gray-50">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm font-medium text-gray-700">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
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