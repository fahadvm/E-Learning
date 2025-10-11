"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BookingSummary from "@/components/student/payment/booking-summary"
import PaymentPanel from "@/components/student/payment/payment-panel"
import { studentBookingApi } from "@/services/APImethods/studentAPImethods"

interface Booking {
    studentId: { name: string };
    teacherId: { name: string };
    courseId: { title: string };
    date: string;
    slot: { start: string, end: string };
    note: string;
}

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId");

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) return;

        const fetchBooking = async () => {
            try {
                const data = await studentBookingApi.getBookingDetails(bookingId);
                console.log("res fresh :", data)
                setBooking(data.data);
            } catch (error) {
                console.error("Error fetching booking:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchBooking();
    }, [bookingId]);

    const paymentMethods = [
        { id: "card", name: "Credit/Debit Card", icon: "card" as const },
        { id: "upi", name: "UPI", icon: "upi" as const },
        { id: "wallet", name: "Wallet", icon: "wallet" as const },
        { id: "net-banking", name: "Net Banking", icon: "bank" as const },
    ];

    if (loading) {
        return <div className="text-center py-20">Loading booking details…</div>
    }

    if (!booking) {
        return <div className="text-center py-20 text-red-500">Booking not found.</div>
    }

    return (
        <main className="min-h-[100svh] bg-background">
            <section className="mx-auto w-full max-w-6xl px-4 py-10 md:py-12">
                <header className="mb-8 md:mb-10">
                    <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Payment Summary</h1>
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
                            <PaymentPanel paymentMethods={paymentMethods} fee={100} note={booking.note} bookingId={bookingId} />
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    )
}
