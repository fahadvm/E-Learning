// app/company/login/page.tsx
import ReusableLoginPage from "@/reusable/ReusableLoginPage";

export default function CompanyLogin() {
  return (
    <ReusableLoginPage
      role="company"
      apiEndpoint="/auth/company/login"
      redirectPath="/company/home"
      signupPath="/company/signup"
      forgotPasswordPath="/company/forgetpassword"
      bannerTitle="Company LOGIN"
      bannerImage="/companyLogin.jpg"
    />
  );
}
