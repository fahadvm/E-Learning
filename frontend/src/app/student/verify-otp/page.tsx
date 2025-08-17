// app/student/verifySignupOtp/page.tsx

"use client";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function SignupOtpPage() {
  return (
    <OtpVerificationPage
      localStorageKey="tempSignupEmail"
      verifyUrl={`${process.env.NEXT_PUBLIC_API_URL}/auth/student/verifyOtp`}
      resendUrl={`${process.env.NEXT_PUBLIC_API_URL}/auth/student/resend-otp`}
      redirectPath="/student/home"
      purpose="signup"
      backToPath="/student/signup"
    />
  );
}
