// src/core/interfaces/services/student/IStudentAuthService.ts
import { IStudent } from '../../../../models/Student';

export interface IStudentAuthService {
  sendOtp(data: IStudent): Promise<void>;
  resendOtp(email: string, purpose: 'signup' | 'forgot-password'): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<{ token: string; refreshToken: string; user: { id: string; role: string; email: string; name: string } }>;
  login(email: string, password: string): Promise<{ token: string; refreshToken: string; user: { id: string; role: string; email: string; name: string } }>;
  googleAuth(idToken: string): Promise<{ token: string; refreshToken: string; user: { id: string; role: string } }>;
  sendForgotPasswordOtp(email: string): Promise<void>;
  verifyForgotOtp(email: string, otp: string): Promise<void>;
 verifyEmailChangeOtp(studentId: string, newEmail: string, otp: string):Promise<IStudent> 
  changePassword(studentId: string, currentPassword: string, newPassword: string): Promise<void>;
  setNewPassword(email: string, newPassword: string): Promise<void>;
  sendEmailChangeOtp(studentId: string, newEmail: string): Promise<void>;
}