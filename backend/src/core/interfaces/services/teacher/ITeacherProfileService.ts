import { ITeacher } from '../../../../models/Teacher';

export interface ITeacherProfileService {
  createProfile(data: Partial<ITeacher>): Promise<ITeacher>;
  updateProfile(teacherId: string, data: Partial<ITeacher>): Promise<ITeacher | null>;
  getProfile(teacherId: string): Promise<ITeacher | null>;
  sendVerificationRequest(teacherId: string, file: Express.Multer.File): Promise<ITeacher>;
  changePassword(teacherId: string, currentPassword: string, newPassword: string): Promise<void>;
  requestEmailChange(teacherId: string, newEmail: string): Promise<void>;
  verifyEmailChangeOtp(teacherId: string, newEmail: string, otp: string): Promise<void>;
}
