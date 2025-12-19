// app/company/verifySignupOtp/page.tsx
"use client";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import dynamic from "next/dynamic";

const OtpVerificationPage = dynamic(() => import("@/reusable/OtpVerificationPage"), { ssr: false });

export default function CompanySignupOtpPage() {
  
  return (
    <OtpVerificationPage
      localStorageKey="tempComSignupEmail"
      verifyUrl={companyApiMethods.verifyOtp}
      resendUrl={companyApiMethods.resendOtp}
      redirectPath="/company/home"
      purpose="signup"
      backToPath="/company/signup"
    />
  );
}
