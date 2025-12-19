"use client";

import { Suspense } from "react";
import PurchaseSuccessContent from "@/components/company/checkout/success-content";

export default function PurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg font-medium">Verifying your payment...</p>
        </div>
      }
    >
      <PurchaseSuccessContent />
    </Suspense>
  );
}
