// app/teacher/verifyForgotOtp/page.tsx
"use client";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function ForgotPasswordOtpPage() {
  return (
    <OtpVerificationPage
      localStorageKey="tempforgetEmail"
      verifyUrl={`${process.env.NEXT_PUBLIC_API_URL}/auth/teacher/verify-forgot-otp`}
      resendUrl={`${process.env.NEXT_PUBLIC_API_URL}/auth/teacher/resend-otp`}
      redirectPath="/teacher/resetPassword"
      purpose="forgot-password"
      backToPath="/teacher/signup"
    />
  );
}
