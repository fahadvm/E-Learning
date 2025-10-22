// app/employee/verifyForgotOtp/page.tsx
"use client";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function ForgotPasswordOtpPage() {
  return (
    <OtpVerificationPage
      localStorageKey="tempforgetEmail"
      verifyUrl={employeeApiMethods.verifyForgotOtp}
      resendUrl={employeeApiMethods.resendOtp}
      redirectPath="/employee/resetPassword"
      purpose="forgot-password"
      backToPath="/employee/signup"
    />
  );
}
