import ReusableLoginPage from "@/reusable/ReusableLoginPage";

export default function StudentLogin() {
  return (
    <ReusableLoginPage
      role="employee"
      apiEndpoint="/auth/employee/login"
      redirectPath="/employee/home"
      signupPath="/employee/signup"
      forgotPasswordPath="/employee/forgetPassword"
      bannerTitle="employee LOGIN"
      bannerImage="/employeeLogin.jpg"
    />
  );
}