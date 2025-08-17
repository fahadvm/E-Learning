// app/student/verifyForgotOtp/page.tsx
"use client";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function ForgotPasswordOtpPage() {
  return (
    <OtpVerificationPage
      localStorageKey="tempforgetEmail"
      verifyUrl={`${process.env.NEXT_PUBLIC_API_URL}/auth/student/verify-forgot-otp`}
      resendUrl={`${process.env.NEXT_PUBLIC_API_URL}/auth/student/resend-otp`}
      redirectPath="/student/resetPassword"
      purpose="forgot-password"
      backToPath="/student/signup"
    />
  );
}
