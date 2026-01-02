import { IAdmin } from '../../../../models/Admin';

export interface IAdminProfileService {
  getProfile(adminId: string): Promise<Omit<IAdmin, 'password'>>;
  updateProfile(adminId: string, updates: Partial<IAdmin>): Promise<Omit<IAdmin, 'password'>>;
  changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<void>;

  // Change Email OTP Flow
  requestEmailChange(adminId: string, newEmail: string): Promise<void>;
  verifyEmailChangeOtp(adminId: string, newEmail: string, otp: string): Promise<void>;

  // Add New Admin (Super Admin only)
  addNewAdmin(requestingAdminId: string, email: string, password: string, name?: string): Promise<Omit<IAdmin, 'password'>>;
}
