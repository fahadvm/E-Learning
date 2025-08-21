// app/company/verifyForgotOtp/page.tsx
"use client";
import { companyApiMethods } from "@/services/APImethods/companyAPImethods";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function CompanyForgotOtpPage() {
  return (
    <OtpVerificationPage
      localStorageKey="tempComSignupEmail"
      verifyUrl={companyApiMethods.verifyForgotOtp}
      resendUrl={companyApiMethods.resendOtp}
      redirectPath="/company/resetPassword"
      purpose="forgot-password"
      backToPath="/company/forgotPassword"
    />
  );
}
