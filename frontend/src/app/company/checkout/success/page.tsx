"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import { companyApiMethods } from "@/services/APIservices/companyApiService";

export default function PurchaseSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("session_id");

  const [orderId, setOrderId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        showErrorToast("No session ID found!");
        router.push("/company/cart");
        return;
      }

      try {
        const res = await companyApiMethods.verifyPayment({ sessionId });
        console.log("response of order details:", res);

        if (res.data.success) {
          showSuccessToast("Payment verified successfully");
          setOrderId(res.data.order._id || sessionId);
          setAmount(res.data.amount || 0);
          setItems(res.data.order.courses || []);
        } else {
          showErrorToast("Payment failed. Please try again.");
          router.push("/company/cart");
        }
      } catch (err) {
        console.error("Verification error:", err);
        showErrorToast("Something went wrong during verification.");
        router.push("/company/cart");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  const handleDownloadReceipt = async () => {
    if (!orderId) return;

    try {
      console.log("🔄 Starting receipt download for order:", orderId);

      const res = await companyApiMethods.downloadReciept(orderId);
      console.log("response is now ",res)
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      console.log("✅ Receipt download completed.");
    } catch (error: any) {
      console.error("❌ Receipt download failed:", error);
      showErrorToast("Unable to download receipt. Try again.");
    }
  };


  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Verifying your payment...</p>
      </div>
    );
  }

  if (!orderId) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 text-lg">Thank you for your purchase. Your courses are now available.</p>
        </div>

        {/* Order Details */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Order Confirmation</h2>
              <span className="text-sm text-gray-500">Order #{orderId.slice(-10)}</span>
            </div>

            {/* Order Items List */}
            <div className="space-y-3 mb-6">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <span className="text-gray-800 font-medium">{item.title}</span>
                    <span className="text-gray-600">₹{item.price}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No course details found.</p>
              )}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total Paid</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{amount ? amount.toFixed(2) : "0.00"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/company/mycourses" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium">
              Go to My Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            className="flex-1 py-3 text-lg font-medium border-gray-300 hover:bg-gray-200 bg-transparent"
          >
            Download Receipt
            <Download className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 p-6 bg-white/50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">A confirmation email has been sent to your email address.</p>
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
