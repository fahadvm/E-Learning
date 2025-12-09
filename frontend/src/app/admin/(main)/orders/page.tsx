"use client";
import { useEffect, useState } from "react";
import { adminApiMethods } from "@/services/APIservices/adminApiService";

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
    const [itemsPerPage] = useState(8);

    useEffect(() => {
        fetchOrders();
        setPage(1); 
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            if (activeTab === "company") {
                const res = await adminApiMethods.getCompanyOrders();
                const mapped = (res?.data || []).map((order: any) => ({
                    ...order,
                    courses: order.purchasedCourses.map((c: any) => ({
                        title: c.courseId?.title,
                        _id: c.courseId?._id,
                        seats: c.seats
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

    return (
        <div className="flex min-h-screen bg-gray-50 p-6">
            <div className="flex-1">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Orders Management</h1>

                {/* Tabs */}
                <div className="flex space-x-4 border-b mb-6">
                    <button
                        onClick={() => setActiveTab("company")}
                        className={`px-4 py-2 font-medium border-b-2 ${
                            activeTab === "company"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-600 hover:text-blue-600"
                        }`}
                    >
                        Company Purchased
                    </button>
                    <button
                        onClick={() => setActiveTab("student")}
                        className={`px-4 py-2 font-medium border-b-2 ${
                            activeTab === "student"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-600 hover:text-blue-600"
                        }`}
                    >
                        Student Purchased
                    </button>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    {loading ? (
                        <p className="text-center text-gray-500 py-6">Loading orders...</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                            <th className="p-3">Order ID</th>
                                            <th className="p-3">{activeTab === "company" ? "Company" : "Student"}</th>
                                            <th className="p-3">Courses</th>
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
                                                                  {c.title} <span className="text-xs text-gray-500">(Seats: {c.seats})</span>
                                                                  {i < order.courses.length - 1 && ", "}
                                                              </span>
                                                          ))}
                                                      </td>
                                                      <td className="p-3 font-semibold text-green-600">₹{order.amount}</td>
                                                      <td className="p-3">
                                                          {new Date(order.createdAt).toLocaleDateString()}
                                                      </td>
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
                                                      <td className="p-3 font-semibold text-green-600">₹{order.amount}</td>
                                                      <td className="p-3">
                                                          {new Date(order.createdAt).toLocaleDateString()}
                                                      </td>
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
                                    <span className="px-3 py-1 text-gray-700">
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
