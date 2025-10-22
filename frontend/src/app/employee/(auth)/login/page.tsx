"use client"
import ReusableLoginPage from "@/reusable/ReusableLoginPage";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";

export default function StudentLogin() {

  return (
    <ReusableLoginPage
      role="employee"
      apiEndpoint={employeeApiMethods.login}
      googleSignup={employeeApiMethods.googleSignup}
      redirectPath="/employee/home"
      signupPath="/employee/signup"
      forgotPasswordPath="/employee/forgetPassword"
      bannerTitle="EMPLOYEE LOGIN"
      bannerImage="/employeeLogin.png"
    />
  );
}
