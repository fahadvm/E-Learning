"use client"
import ReusableLoginPage from "@/reusable/ReusableLoginPage";
import { studentAuthApi } from "@/services/APIservices/studentApiservice";

export default  function StudentLogin() {

  return (
    <ReusableLoginPage
      role="student"
      apiEndpoint = {studentAuthApi.login} 
      redirectPath="/student/home"
      signupPath="/student/signup"
      forgotPasswordPath="/student/forgetPassword"
      bannerTitle="STUDENT LOGIN"
      bannerImage="/studentLogin.png"
    />
  );
}
