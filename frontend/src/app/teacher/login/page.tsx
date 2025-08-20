"use client"
import ReusableLoginPage from "@/reusable/ReusableLoginPage";
import { teacherAuthApi } from "@/services/APImethods/teacherAPImethods";

export default function StudentLogin() {
  return (
    <ReusableLoginPage
      role="teacher"
      apiEndpoint={teacherAuthApi.login}
      redirectPath="/teacher/home"
      signupPath="/teacher/signup"
      forgotPasswordPath="/teacher/forgetPassword"
      bannerTitle="TEACHER LOGIN"
      bannerImage="/teacherLogin.jpg"
    />
  );
}