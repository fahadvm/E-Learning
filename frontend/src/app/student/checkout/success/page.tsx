"use client";

import { Suspense } from "react";
import PurchaseSuccessContent from "@/components/student/checkout/success-content";

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PurchaseSuccessContent />
    </Suspense>
  );
}
