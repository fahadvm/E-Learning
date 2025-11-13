import { inject, injectable } from 'inversify';
import { IAdminProfileService } from '../../core/interfaces/services/admin/IAdminProfileService';
import { IAdminRepository } from '../../core/interfaces/repositories/IAdminRepository';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import bcrypt from  'bcrypt';
import { IAdmin } from '../../models/Admin';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

@injectable()
export class AdminProfileService implements IAdminProfileService {
  constructor(
    @inject(TYPES.AdminRepository)
    private _adminRepo: IAdminRepository
  ) {}

  async getProfile(adminId: string): Promise<IAdmin> {
    const admin = await this._adminRepo.findById(adminId);
    if (!admin) throwError(MESSAGES.ADMIN_NOT_FOUND,STATUS_CODES.NOT_FOUND);
    return admin;
  }

  async updateProfile(adminId: string, updates: Partial<IAdmin>): Promise<Omit<IAdmin, 'password'>> {
    const allowedFields = ['name', 'email', 'phone', 'avatar'];
    const filteredUpdates: Partial<IAdmin> = {};

    for (const key of allowedFields) {
      if (updates[key as keyof IAdmin] !== undefined) {
        filteredUpdates[key as keyof IAdmin] = updates[key as keyof IAdmin];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      throwError(MESSAGES.PROFILE_UPDATE_FAILED, STATUS_CODES.BAD_REQUEST);
    }

    const updatedAdmin = await this._adminRepo.update(adminId, filteredUpdates);
    if (!updatedAdmin) throwError(MESSAGES.PROFILE_UPDATE_FAILED);

    return updatedAdmin;
  }

  async changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<void> {
    const admin = await this._adminRepo.findById(adminId);
    if (!admin) throwError(MESSAGES.ADMIN_NOT_FOUND);

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) throwError(MESSAGES.PASSWORD_INCORRECT, STATUS_CODES.BAD_REQUEST);

    if (currentPassword === newPassword) {
      throwError(MESSAGES.NEW_PASSWORD_SAME_AS_OLD, STATUS_CODES.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._adminRepo.updatePassword(adminId, hashedPassword);
  }
}