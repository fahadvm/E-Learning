"use client";

import { Suspense } from "react";
import ResetPasswordContent from "@/components/company/resetpassword/reset-password-content";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
