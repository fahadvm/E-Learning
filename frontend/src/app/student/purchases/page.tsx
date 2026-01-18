"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  CreditCard,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Header from "@/components/student/header";
import { paymentApi } from "@/services/APIservices/studentApiservice";
import { downloadBlobFile } from "@/utils/fileDownload";
import { showErrorToast } from "@/utils/Toast";

interface PurchaseOrder {
  _id: string;
  amount: number;
  status: "created" | "paid" | "failed";
  paymentMethod?: string;
  razorpayOrderId: string;
  createdAt: string;
  courses: {
    _id: string;
    title: string;
    instructor?: {
      name: string;
      profilePicture?: string;
    };
  }[];
}

export default function PurchaseHistoryPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // items per page; change as needed
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await paymentApi.getPurchaseHistory({ page, limit });
      // expecting res.data.orders, and either res.data.totalPages or res.data.totalCount

      const resOrders = res?.data?.orders ?? [];
      const tp = res?.data?.totalPages;
      const totalCount = res?.data?.totalCount;

      setOrders(resOrders);

      if (typeof tp === "number") {
        setTotalPages(Math.max(1, tp));
      } else if (typeof totalCount === "number") {
        setTotalPages(Math.max(1, Math.ceil(totalCount / limit)));
      } else {
        // fallback: if backend doesn't provide totals, attempt to infer:
        // if fewer items than limit and page === 1 => only 1 page
        if (resOrders.length < limit && page === 1) setTotalPages(1);
        // otherwise keep previous totalPages (or 1)
      }
    } catch (error) {
      console.error("Failed to fetch purchase history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (razorpayOrderId: string) => {
    try {
      setDownloadingOrderId(razorpayOrderId);
      const blob = await paymentApi.downloadReceipt(razorpayOrderId);
      if (blob) {
        downloadBlobFile(blob, `invoice-${razorpayOrderId}.pdf`);
      } else {
        showErrorToast("Failed to download receipt");
      }
    } catch (error) {
      console.error("Download error:", error);
      showErrorToast("Failed to download receipt");
    } finally {
      setDownloadingOrderId(null);
    }
  };

  const formatStatusBadge = (status: PurchaseOrder["status"]) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="secondary">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case "created":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatPrice = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

  // Helper to produce a truncated page list (numbers and '...' placeholders)
  const getPageItems = (current: number, total: number) => {
    const items: (number | "...")[] = [];
    const maxButtons = 7;
    if (total <= maxButtons) {
      for (let i = 1; i <= total; i++) items.push(i);
      return items;
    }

    const left = Math.max(1, current - 2);
    const right = Math.min(total, current + 2);

    if (left > 1) {
      items.push(1);
      if (left > 2) items.push("...");
    }

    for (let i = left; i <= right; i++) items.push(i);

    if (right < total) {
      if (right < total - 1) items.push("...");
      items.push(total);
    }

    return items;
  };

  // Skeleton card used while loading
  const SkeletonCard = () => (
    <div className="animate-pulse border rounded-lg p-5 bg-white">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded mt-2" />
          <div className="h-3 w-28 bg-gray-200 rounded mt-2" />
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded" />
      </div>
      <div className="mt-4 flex justify-between">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-8 w-32 bg-gray-200 rounded" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Purchase History</h1>
              <p className="text-sm text-gray-500">
                View all your course purchases and invoices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== LOADING ===================== */}
      {loading ? (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* ===================== EMPTY CASE ===================== */}
          {orders.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="w-20 h-20 bg-gray-200 border-2 border-dashed rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No purchases yet</h3>
                <p className="text-gray-500 mb-6">
                  When you buy a course, it will appear here
                </p>
                <Button onClick={() => router.push("/student/courses")}>
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const course = order.courses[0]; // each order may contain 1 course

                return (
                  <Card
                    key={order._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* COURSE TITLE + INSTRUCTOR */}
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {course?.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            {course?.instructor?.name && (
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={course.instructor.profilePicture} />
                                  <AvatarFallback className="text-xs">
                                    {course.instructor.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{course.instructor.name}</span>
                              </div>
                            )}

                            <Separator orientation="vertical" className="h-4" />

                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(order.createdAt), "dd MMM yyyy")}
                            </div>
                          </div>
                        </div>

                        {/* PRICE + ORDER ID */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatPrice(order.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Order ID: {order.razorpayOrderId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <Separator />

                    {/* ORDER DETAILS */}
                    <CardContent className="pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          {formatStatusBadge(order.status)}

                          <div className="flex items-center gap-1 text-gray-600">
                            <CreditCard className="w-4 h-4" />
                            Paid via {order.paymentMethod || "Online"}
                          </div>

                          <div className="flex items-center gap-1 text-gray-600">
                            <FileText className="w-4 h-4" />
                            Invoice: {order.razorpayOrderId}
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-2">
                          {order.status === "paid" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadReceipt(order.razorpayOrderId)}
                                disabled={downloadingOrderId === order.razorpayOrderId}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                {downloadingOrderId === order.razorpayOrderId ? "..." : "Invoice"}
                              </Button>

                              <Button
                                size="sm"
                                onClick={() => router.push(`/student/courses/${course._id}`)}
                              >
                                View Course
                              </Button>
                            </>
                          )}

                          {order.status === "failed" && (
                            <Button size="sm" variant="secondary" disabled>
                              Payment Failed
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* ========== Pagination Controls ========== */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing page <span className="font-medium">{page}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Limit selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Per page</span>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setPage(1);
                        setLimit(Number(e.target.value));
                      }}
                      className="border rounded-md px-2 py-1 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>

                  {/* Prev */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1 || loading}
                    onClick={() => {
                      const next = Math.max(1, page - 1);
                      setPage(next);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Previous
                  </Button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {getPageItems(page, totalPages).map((p, idx) =>
                      p === "..." ? (
                        <div key={`dot-${idx}`} className="px-2 text-sm">
                          ...
                        </div>
                      ) : (
                        <button
                          key={p}
                          onClick={() => {
                            if (p === page) return;
                            setPage(p);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`h-9 min-w-[36px] px-2 rounded-md border text-sm flex items-center justify-center transition
                          ${p === page ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  {/* Next */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages || loading}
                    onClick={() => {
                      const next = Math.min(totalPages, page + 1);
                      setPage(next);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
