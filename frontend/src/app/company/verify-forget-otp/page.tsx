// app/company/verifyForgotOtp/page.tsx
"use client";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function CompanyForgotOtpPage() {
  return (
    <OtpVerificationPage
      localStorageKey="tempComSignupEmail"
      verifyUrl={`${process.env.NEXT_PUBLIC_API_URL}/auth/company/verify-forgot-otp`}
      resendUrl={`${process.env.NEXT_PUBLIC_API_URL}/auth/company/resend-otp`}
      redirectPath="/company/resetPassword"
      purpose="forgot-password"
      backToPath="/company/forgotPassword"
    />
  );
}
