export interface ICompanyAuthService {
  sendOtp(data: { name: string; email: string; password: string }): Promise<void>;

  verifyOtp(email: string, otp: string): Promise<any>;

  login(email: string, password: string): Promise<{
    token: string;
    refreshToken: string;
    company: {
      id: string;
      name: string;
      email: string;
    };
  }>;

  forgotPassword(email: string): Promise<void>;

  resetPassword(email: string,  newPassword: string): Promise<void>;

  verifyForgotOtp(email: string, otp: string): Promise<void>;

  resendForgotPasswordOtp(email: string): Promise<void>;
}
