"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingSummary from "@/components/student/payment/booking-summary";
import PaymentPanel from "@/components/student/payment/payment-panel";
import { studentBookingApi } from "@/services/APIservices/studentApiservice";
import { useStudent } from "@/context/studentContext";
import { IBooking } from "@/types/student/booking";

export default function PaymentPageContent() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId");

  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const { student } = useStudent();

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const res = await studentBookingApi.getBookingDetails(bookingId);
        setBooking(res.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) return <div className="text-center py-20">Loading booking details...</div>;
  if (!bookingId) return <div className="text-center py-20 text-red-500">Booking ID not found.</div>;
  if (!booking) return <div className="text-center py-20 text-red-500">Booking not found.</div>;
  if (!student) return <div className="text-center py-20 text-red-500">Student details not found.</div>;

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "card" as const },
    { id: "upi", name: "UPI", icon: "upi" as const },
    { id: "wallet", name: "Wallet", icon: "wallet" as const },
    { id: "net-banking", name: "Net Banking", icon: "bank" as const },
  ];

  return (
    <main className="min-h-[100svh] bg-background">
      <section className="mx-auto w-full max-w-6xl px-4 py-10 md:py-12">
        <header className="mb-8 md:mb-10">
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Payment Summary
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review your booking details and choose a payment method to proceed.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-xl">Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingSummary booking={booking} />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentPanel
                student={student}
                paymentMethods={paymentMethods}
                fee={100}
                note={booking.note}
                bookingId={bookingId}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
