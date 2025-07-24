import { IStudent } from "../../../../models/Student";
import { GooglePayLoad } from "../../../../types/userTypes";

export interface IStudentAuthService {
  sendOtp(data: IStudent): Promise<void>;

  verifyOtp(email: string, otp: string): Promise<{
    token: string;
    refreshToken: string;
    user: {
      id: string;
      role: string;
      email: string;
      name: string;
    };
  }>;

  login(email: string, password: string): Promise<{
    token: string;
    refreshToken: string;
    user: {
      id: string;
      role: string;
      email: string;
      name: string;
    };
  }>;

  googleAuth(profile: GooglePayLoad): Promise<{
    token: string;
    refreshToken: string;
    user: {
      id: string;
      role: string;
    };
  }>;

  sendForgotPasswordOtp(email: string): Promise<void>;
  verifyForgotOtp(email: string, otp: string): Promise<void>;
  setNewPassword(email: string, newPassword: string): Promise<void>;
  resendOtp(email: string, purpose: "signup" | "forgot-password"): Promise<void>;

  handleGoogleSignup(idToken: string): Promise<{
    user: {
      id: string;
      role: string;
    };
    token: string;
  }>;
}
