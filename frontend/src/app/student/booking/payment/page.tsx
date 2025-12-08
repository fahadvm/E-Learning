"use client";

import { Suspense } from "react";
import PaymentPageContent from "@/components/student/booking/payment-content";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading booking details…</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
