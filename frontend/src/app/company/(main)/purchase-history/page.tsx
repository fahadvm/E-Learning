'use client'

import Header from "@/components/company/Header";
import { Download } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showErrorToast } from "@/utils/Toast";
import { downloadBlobFile } from "@/utils/fileDownload";

interface IPurchasedCourse {
    courseId: {
        _id: string;
        title: string;
        coverImage?: string;
        price: number;
    };
    accessType: "seats" | "unlimited";
    seats: number;
    price: number;
}

interface IOrder {
    _id: string;
    purchasedCourses: IPurchasedCourse[];
    amount: number;
    currency: string;
    status: "created" | "paid" | "failed";
    paymentMethod: string;
    createdAt: string;
}

export default function PurchaseHistoryPage() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await companyApiMethods.getOrderHistory();
            console.log("Order history:", response);
            setOrders(response.data || []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            showErrorToast("Failed to load purchase history");
        } finally {
            setLoading(false);
        }
    };

    const statusStyle = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-500/20 text-green-300 border-green-500/30";
            case "failed":
                return "bg-red-500/20 text-red-300 border-red-500/30";
            default:
                return "bg-yellow-500/20 text-yellow-200 border-yellow-500/30";
        }
    };

    const downloadReceipt = async (orderId: string) => {
        try {
            setDownloadingOrderId(orderId);
            const blob = await companyApiMethods.downloadReceipt(orderId);
            if (blob) {
                downloadBlobFile(blob, `receipt_${orderId}.pdf`);
            } else {
                showErrorToast("Failed to download receipt");
            }
        } catch (error) {
            console.error("Failed to download receipt:", error);
            showErrorToast("Failed to download receipt");
        } finally {
            setDownloadingOrderId(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white relative">
            {/* Background Glows */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/5 to-slate-900" />
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/15 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                <Header />

                {/* Page Header */}
                <div className="mt-10 max-w-7xl mx-auto px-6 py-12">
                    <h1 className="text-4xl font-bold mb-4">Purchase History</h1>
                    <p className="text-gray-300">
                        Track all company course purchases, invoices, and payment details.
                    </p>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6">
                    {loading ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400">Loading purchase history...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                            <p className="text-gray-400 text-lg">No purchase history found</p>
                            <p className="text-gray-500 text-sm mt-2">Your completed purchases will appear here</p>
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/10 text-gray-300 text-sm">
                                            <th className="p-4">Course(s)</th>
                                            <th className="p-4">Seats</th>
                                            <th className="p-4">Total Price</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Payment</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-center">Invoice</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {orders.map(order => (
                                            <tr
                                                key={order._id}
                                                className="border-t border-white/10 hover:bg-white/5 transition"
                                            >
                                                <td className="p-4">
                                                    <div className="space-y-2">
                                                        {order.purchasedCourses.map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-3">
                                                                <Image
                                                                    src={item.courseId.coverImage || "/placeholder.svg"}
                                                                    width={50}
                                                                    height={50}
                                                                    alt={item.courseId.title}
                                                                    className="rounded-lg object-cover"
                                                                />
                                                                <div>
                                                                    <span className="font-medium block">{item.courseId.title}</span>
                                                                    <span className="text-xs text-gray-400">
                                                                        {item.seats} seat{item.seats > 1 ? 's' : ''} × ₹{item.courseId.price}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>

                                                <td className="p-4 text-gray-300">
                                                    {order.purchasedCourses.reduce((sum, item) => sum + item.seats, 0)}
                                                </td>

                                                <td className="p-4 font-semibold text-primary">₹{order.amount}</td>

                                                <td className="p-4 text-gray-300">{formatDate(order.createdAt)}</td>

                                                <td className="p-4 text-gray-300 capitalize">{order.paymentMethod}</td>

                                                <td className="p-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full border text-xs font-medium capitalize ${statusStyle(
                                                            order.status
                                                        )}`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-center">
                                                    {order.status === "paid" && (
                                                        <button
                                                            onClick={() => downloadReceipt(order._id)}
                                                            disabled={downloadingOrderId === order._id}
                                                            className={`p-2 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary transition ${downloadingOrderId === order._id ? 'opacity-50' : ''}`}
                                                            title="Download Receipt"
                                                        >
                                                            {downloadingOrderId === order._id ? "..." : <Download size={18} />}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Footer spacing */}
                    <div className="h-16" />
                </div>
            </div>
        </div>
    );
}
