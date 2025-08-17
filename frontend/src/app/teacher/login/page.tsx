import ReusableLoginPage from "@/reusable/ReusableLoginPage";

export default function StudentLogin() {
  return (
    <ReusableLoginPage
      role="teacher"
      apiEndpoint="/auth/teacher/login"
      redirectPath="/teacher/home"
      signupPath="/teacher/signup"
      forgotPasswordPath="/teacher/forgetPassword"
      bannerTitle="TEACHER LOGIN"
      bannerImage="/teacherLogin.jpg"
    />
  );
}