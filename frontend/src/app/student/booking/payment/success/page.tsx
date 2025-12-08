"use client";

import { Suspense } from "react";
import BookingPurchaseSuccessContent from "@/components/student/booking/success-content";

export default function BookingPurchaseSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Fetching booking details...</p>
      </div>
    }>
      <BookingPurchaseSuccessContent />
    </Suspense>
  );
}
