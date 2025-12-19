// app/company/login/page.tsx
"use client"
import ReusableLoginPage from "@/reusable/ReusableLoginPage";
import { companyApiMethods } from "@/services/APIservices/companyApiService";

export default function CompanyLogin() {
  return (
    <ReusableLoginPage
      role="company"
      apiEndpoint={companyApiMethods.login}
      redirectPath="/company/home"
      signupPath="/company/signup"
      forgotPasswordPath="/company/forgetpassword"
      bannerTitle="Company LOGIN"
      bannerImage="/companyLogin.jpg"
    />
  );
}
