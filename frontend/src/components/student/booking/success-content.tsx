"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Download, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { studentBookingApi } from "@/services/APIservices/studentApiservice";
import { convertTo12Hour } from "@/utils/timeConverter";
import { BookingDetails } from "@/types/student/booking";

export default function BookingPurchaseSuccessContent() {
  const params = useSearchParams();
  const paymentOrderId = params.get("orderId");
  const amount = params.get("amount");

  const [booking, setBooking] = useState<BookingDetails | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!paymentOrderId) return;

      try {
        const res = await studentBookingApi.getBookingDetailsBypaymentOrderId(paymentOrderId);
        if (res.ok) {
          setBooking(res.data);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBooking();
  }, [paymentOrderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 text-lg">Your video session has been booked successfully.</p>
        </div>

        {/* Booking Summary */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            {booking ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                  <span className="text-sm text-gray-500">Order #{booking.paymentOrderId}</span>
                </div>

                <div className="space-y-4 text-gray-700">
                  <div className="flex justify-between">
                    <span>Teacher</span>
                    <span className="font-medium">{booking.teacherId.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Course</span>
                    <span className="font-medium">{booking.courseId.title}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Date</span>
                    <span className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {booking.day}, {booking.date}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Time</span>
                    <span className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" /> {convertTo12Hour(booking.slot.start)} - {convertTo12Hour(booking.slot.end)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Paid</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{booking.amount || Number(amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">Loading booking details...</p>
            )}
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/student/callschedule" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium">
              Go to My Bookings
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <Button
            variant="outline"
            className="flex-1 py-3 text-lg font-medium border-gray-300 hover:bg-gray-50 bg-transparent"
          >
            Download Receipt
            <Download className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 p-6 bg-white/50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">A confirmation email has been sent to your registered address.</p>
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
