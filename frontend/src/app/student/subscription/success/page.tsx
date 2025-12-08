"use client";

import { Suspense } from "react";
import SubscriptionSuccessContent from "@/components/student/subscription/subscription-content";

export default function SubscriptionSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg font-medium">Activating subscription...</p>
        </div>
      }
    >
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
