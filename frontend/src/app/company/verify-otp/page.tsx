// app/company/verifySignupOtp/page.tsx
"use client";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function CompanySignupOtpPage() {
  
  return (
    <OtpVerificationPage
      localStorageKey="tempComSignupEmail"
      verifyUrl={`${process.env.NEXT_PUBLIC_API_URL}/auth/company/verify-otp`}
      resendUrl={`${process.env.NEXT_PUBLIC_API_URL}/auth/company/resend-otp`}
      redirectPath="/company/home"
      purpose="signup"
      backToPath="/company/signup"
    />
  );
}
