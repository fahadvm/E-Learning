// app/employee/verifySignupOtp/page.tsx

"use client";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function SignupOtpPage() {
  return (
    <OtpVerificationPage
      localStorageKey="tempSignupEmail"
      verifyUrl={employeeApiMethods.verifyOtp}
      resendUrl={employeeApiMethods.resendOtp}
      redirectPath="/employee/home"
      purpose="signup"
      backToPath="/employee/signup"
    />
  );
}
