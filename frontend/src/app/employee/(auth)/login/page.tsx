"use client"
import ReusableLoginPage from "@/reusable/ReusableLoginPage";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";

export default  function StudentLogin() {

  return (
    <ReusableLoginPage
      role="employee"
      apiEndpoint = {employeeApiMethods.login} 
      redirectPath="/employee/home"
      signupPath="/employee/signup"
      forgotPasswordPath="/employee/forgetPassword"
      bannerTitle="STUDENT LOGIN"
      bannerImage="/employeeLogin.png"
    />
  );
}
