import { inject, injectable } from 'inversify';
import { ICompanyProfileService } from '../../core/interfaces/services/company/ICompanyProfileService';
import { ICompanyRepository } from '../../core/interfaces/repositories/ICompanyRepository';
import { ICompany } from '../../models/Company';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { throwError } from '../../utils/ResANDError';
import { TYPES } from '../../core/di/types';
import cloudinary from '../../config/cloudinary';
import { generateOtp, sendOtpEmail } from '../../utils/OtpServices';
import bcrypt from 'bcryptjs';

// In-memory OTP storage for email change
const emailOtpStore = new Map<string, { otp: string; newEmail: string; companyId: string; createdAt: number; attempts: number }>();

@injectable()
export class CompanyProfileService implements ICompanyProfileService {
  constructor(
    @inject(TYPES.CompanyRepository) private readonly _companyRepository: ICompanyRepository,
  ) { }

  // Helper for Cloudinary upload
  private async uploadToCloudinary(file: Express.Multer.File, folder: string, resourceType: 'video' | 'image' | 'raw' | 'auto' = 'auto'): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: resourceType, folder }, (error, result) => {
        if (error || !result) reject(error || new Error('Upload failed'));
        else resolve(result.secure_url);
      }).end(file.buffer);
    });
  }

  async getProfile(id: string): Promise<ICompany> {
    const company = await this._companyRepository.findById(id);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return company;
  }

  async updateProfile(id: string, data: Partial<ICompany>): Promise<ICompany> {
    const updated = await this._companyRepository.updateById(id, data);
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return updated;
  }

  async requestVerification(
    companyId: string,
    name: string,
    address: string,
    pincode: string,
    phone: string,
    certificateFile: Express.Multer.File,
    taxIdFile: Express.Multer.File
  ): Promise<ICompany | null> {
    const existing = await this._companyRepository.findById(companyId);

    if (!existing) {
      throwError('Company not found', STATUS_CODES.NOT_FOUND);
    }

    if (existing.status === 'pending') {
      throwError('Verification already submitted', STATUS_CODES.BAD_REQUEST);
    }

    const certificateUrl = await this.uploadToCloudinary(certificateFile, 'company/certificates');
    const taxIdUrl = await this.uploadToCloudinary(taxIdFile, 'company/taxIds');

    const updateData = {
      name,
      address,
      pincode,
      phone,
      status: 'pending',
      isVerified: false,
      registrationDocs: {
        certificate: certificateUrl,
        taxId: taxIdUrl
      }
    };
    const updated = await this._companyRepository.updateById(companyId, updateData);

    return updated;
  }

  // Email Change with OTP
  async sendEmailChangeOTP(companyId: string, newEmail: string): Promise<void> {
    // Check if company exists
    const company = await this._companyRepository.findById(companyId);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    // Check if new email is already in use
    const existingCompany = await this._companyRepository.findByEmail(newEmail);
    if (existingCompany && existingCompany._id.toString() !== companyId) {
      throwError('Email already in use', STATUS_CODES.BAD_REQUEST);
    }

    // Check rate limiting (1 OTP per minute)
    const existing = emailOtpStore.get(companyId);
    if (existing && Date.now() - existing.createdAt < 60000) {
      throwError('Please wait 1 minute before requesting another OTP', STATUS_CODES.BAD_REQUEST);
    }

    // Generate OTP
    const otp = generateOtp(6);

    // Store OTP (expires in 5 minutes)
    emailOtpStore.set(companyId, {
      otp,
      newEmail,
      companyId,
      createdAt: Date.now(),
      attempts: 0
    });

    // Send OTP email
    await sendOtpEmail(newEmail, otp);

    // Clean up expired OTPs
    setTimeout(() => {
      const stored = emailOtpStore.get(companyId);
      if (stored && Date.now() - stored.createdAt >= 300000) {
        emailOtpStore.delete(companyId);
      }
    }, 300000); // 5 minutes
  }

  async verifyEmailChangeOTP(companyId: string, newEmail: string, otp: string): Promise<ICompany> {
    const stored = emailOtpStore.get(companyId);

    if (!stored) {
      throwError('OTP expired or not found. Please request a new one.', STATUS_CODES.BAD_REQUEST);
    }

    // Check if OTP expired (5 minutes)
    if (Date.now() - stored.createdAt > 300000) {
      emailOtpStore.delete(companyId);
      throwError('OTP expired. Please request a new one.', STATUS_CODES.BAD_REQUEST);
    }

    // Check attempts (max 3)
    if (stored.attempts >= 3) {
      emailOtpStore.delete(companyId);
      throwError('Too many failed attempts. Please request a new OTP.', STATUS_CODES.BAD_REQUEST);
    }

    // Verify OTP
    if (stored.otp !== otp || stored.newEmail !== newEmail) {
      stored.attempts++;
      throwError('Invalid OTP', STATUS_CODES.BAD_REQUEST);
    }

    // Update email
    const updated = await this._companyRepository.updateById(companyId, { email: newEmail });
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    // Clear OTP
    emailOtpStore.delete(companyId);

    return updated;
  }

  // Password Change
  async changePassword(companyId: string, currentPassword: string, newPassword: string): Promise<void> {
    const company = await this._companyRepository.findById(companyId);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    // Verify current password
    if (!company.password) {
      throwError('Password not set for this account', STATUS_CODES.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(currentPassword, company.password);
    if (!isMatch) {
      throwError('Current password is incorrect', STATUS_CODES.BAD_REQUEST);
    }

    // Validate new password
    if (newPassword.length < 6) {
      throwError('New password must be at least 6 characters long', STATUS_CODES.BAD_REQUEST);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this._companyRepository.updateById(companyId, { password: hashedPassword });
  }
}
