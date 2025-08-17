import ReusableLoginPage from "@/reusable/ReusableLoginPage";

export default  function StudentLogin() {

  return (
    <ReusableLoginPage
      role="student"
      apiEndpoint="/auth/student/login"
      redirectPath="/student/home"
      signupPath="/student/signup"
      forgotPasswordPath="/student/forgetPassword"
      bannerTitle="STUDENT LOGIN"
      bannerImage="/studentLogin.png"
    />
  );
}
