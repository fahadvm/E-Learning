// app/student/verifyForgotOtp/page.tsx
"use client";
import { studentAuthApi } from "@/services/APIservices/studentApiservice";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function ForgotPasswordOtpPage() {
  return (
    <OtpVerificationPage
      localStorageKey="tempforgetEmail"
      verifyUrl={studentAuthApi.verifyForgotOtp}
      resendUrl={studentAuthApi.resendOtp}
      redirectPath="/student/resetPassword"
      purpose="forgot-password"
      backToPath="/student/signup"
    />
  );
}
