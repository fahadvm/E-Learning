// app/teacher/verifyForgotOtp/page.tsx
"use client";
import { teacherAuthApi } from "@/services/APIservices/teacherApiService";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function ForgotPasswordOtpPage() {
  return (
    <OtpVerificationPage
      localStorageKey="tempforgetEmail"
      verifyUrl={teacherAuthApi.verifyForgotOtp}
      resendUrl={teacherAuthApi.resendOtp}
      redirectPath="/teacher/resetPassword"
      purpose="forgot-password"
      backToPath="/teacher/signup"
    />
  );
}
