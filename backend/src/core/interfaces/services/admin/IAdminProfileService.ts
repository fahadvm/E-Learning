import { IAdmin } from "../../../../models/Admin";

export interface IAdminProfileService {
  getProfile(adminId: string): Promise<Omit<IAdmin, 'password'>>;
  updateProfile(adminId: string, updates: Partial<IAdmin>): Promise<Omit<IAdmin, 'password'>>;
  changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<void>;
}