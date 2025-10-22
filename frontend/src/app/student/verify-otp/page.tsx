// app/student/verifySignupOtp/page.tsx

"use client";
import { studentAuthApi } from "@/services/APIservices/studentApiservice";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function SignupOtpPage() {
  return (
    <OtpVerificationPage
      localStorageKey="tempSignupEmail"
      verifyUrl={studentAuthApi.verifyOtp}
      resendUrl={studentAuthApi.resendOtp}
      redirectPath="/student/home"
      purpose="signup"
      backToPath="/student/signup"
    />
  );
}
