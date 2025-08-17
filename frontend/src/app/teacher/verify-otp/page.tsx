// app/teacher/verifySignupOtp/page.tsx

"use client";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function SignupOtpPage() {
  return (
    <OtpVerificationPage
      localStorageKey="tempSignupEmail"
      verifyUrl={`${process.env.NEXT_PUBLIC_API_URL}/auth/teacher/verifyOtp`}
      resendUrl={`${process.env.NEXT_PUBLIC_API_URL}/auth/teacher/resend-otp`}
      redirectPath="/teacher/home"
      purpose="signup"
      backToPath="/teacher/signup"
    />
  );
}
