// app/teacher/verifySignupOtp/page.tsx

"use client";
import { teacherAuthApi } from "@/services/APImethods/teacherAPImethods";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function SignupOtpPage() {
  return (
    <OtpVerificationPage
      localStorageKey="tempSignupEmail"
      verifyUrl={teacherAuthApi.verifyOtp}
      resendUrl={teacherAuthApi.resendOtp}
      redirectPath="/teacher/home"
      purpose="signup"
      backToPath="/teacher/signup"
    />
  );
}
