import { inject, injectable } from 'inversify';
import { IAdminProfileService } from '../../core/interfaces/services/admin/IAdminProfileService';
import { IAdminRepository } from '../../core/interfaces/repositories/IAdminRepository';
import { IOtpRepository } from '../../core/interfaces/repositories/admin/IOtpRepository';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import bcrypt from 'bcrypt';
import { IAdmin } from '../../models/Admin';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { generateOtp, sendOtpEmail } from '../../utils/OtpServices';

@injectable()
export class AdminProfileService implements IAdminProfileService {
  constructor(
    @inject(TYPES.AdminRepository)
    private _adminRepo: IAdminRepository,
    @inject(TYPES.OtpRepository)
    private _otpRepo: IOtpRepository
  ) { }

  async getProfile(adminId: string): Promise<IAdmin> {
    const admin = await this._adminRepo.findById(adminId);
    if (!admin) throwError(MESSAGES.ADMIN_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return admin;
  }

  async updateProfile(adminId: string, updates: Partial<IAdmin>): Promise<Omit<IAdmin, 'password'>> {
    const allowedFields = ['name', 'phone', 'bio'];
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

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throwError('Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character', STATUS_CODES.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._adminRepo.updatePassword(adminId, hashedPassword);
  }

  async requestEmailChange(adminId: string, newEmail: string): Promise<void> {
    // Check if new email is already in use
    const existingAdmin = await this._adminRepo.findByEmail(newEmail);
    if (existingAdmin) {
      throwError('Email already in use', STATUS_CODES.BAD_REQUEST);
    }

    // Generate and send OTP
    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Delete any existing OTP for this email
    await this._otpRepo.deleteByEmail(newEmail, 'change-email');

    // Create new OTP
    await this._otpRepo.create({
      email: newEmail,
      otp,
      expiresAt,
      purpose: 'change-email'
    });

    // Send OTP email
    await sendOtpEmail(newEmail, otp);
  }

  async verifyEmailChangeOtp(adminId: string, newEmail: string, otp: string): Promise<void> {
    // Find OTP
    const otpRecord = await this._otpRepo.findByEmail(newEmail, 'change-email');

    if (!otpRecord) {
      throwError('OTP not found or expired', STATUS_CODES.BAD_REQUEST);
    }

    if (otpRecord.otp !== otp) {
      throwError('Invalid OTP', STATUS_CODES.BAD_REQUEST);
    }

    // Check if email is still available
    const existingAdmin = await this._adminRepo.findByEmail(newEmail);
    if (existingAdmin) {
      throwError('Email already in use', STATUS_CODES.BAD_REQUEST);
    }

    // Update email
    await this._adminRepo.updateEmail(adminId, newEmail);

    // Delete OTP after successful verification
    await this._otpRepo.deleteByEmail(newEmail, 'change-email');
  }

  async addNewAdmin(requestingAdminId: string, email: string, password: string, name?: string): Promise<Omit<IAdmin, 'password'>> {
    // Check if requesting admin is super admin
    const requestingAdmin = await this._adminRepo.findById(requestingAdminId);
    if (!requestingAdmin || !requestingAdmin.isSuperAdmin) {
      throwError('Only super admins can add new admins', STATUS_CODES.FORBIDDEN);
    }

    // Check if email already exists
    const existingAdmin = await this._adminRepo.findByEmail(email);
    if (existingAdmin) {
      throwError('Admin with this email already exists', STATUS_CODES.BAD_REQUEST);
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throwError('Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character', STATUS_CODES.BAD_REQUEST);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await this._adminRepo.create({
      email,
      password: hashedPassword,
      name: name || '',
      role: 'admin',
      isSuperAdmin: false
    });

    // Send welcome email (optional - you can implement this)
    // await sendWelcomeEmail(email, password);

    // Return admin without password
    const { password: _, ...adminWithoutPassword } = newAdmin;
    return adminWithoutPassword as Omit<IAdmin, 'password'>;
  }
}
