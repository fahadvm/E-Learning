// application/services/TeacherProfileService.ts
import { injectable, inject } from 'inversify';
import { ITeacherProfileService } from '../../core/interfaces/services/teacher/ITeacherProfileService';
import { ITeacherRepository } from '../../core/interfaces/repositories/ITeacherRepository';
import { ITeacher, VerificationStatus } from '../../models/Teacher';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import cloudinary from '../../config/cloudinary';
import bcrypt from 'bcrypt';
import { IOtpRepository } from '../../core/interfaces/repositories/admin/IOtpRepository';
import { generateOtp, sendOtpEmail } from '../../utils/OtpServices';

@injectable()
export class TeacherProfileService implements ITeacherProfileService {
  constructor(
    @inject(TYPES.TeacherRepository) private _teacherRepository: ITeacherRepository
  ) { }

  async createProfile(data: Partial<ITeacher>): Promise<ITeacher> {
    if (!data.email) throwError(MESSAGES.EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const existing = await this._teacherRepository.findByEmail(data.email);
    if (existing) throwError(MESSAGES.TEACHER_ALREADY_EXISTS, STATUS_CODES.CONFLICT);

    return await this._teacherRepository.create(data);
  }

  async updateProfile(teacherId: string, data: Partial<ITeacher>): Promise<ITeacher | null> {

    const updated = await this._teacherRepository.updateById(teacherId, data);
    if (!updated) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return updated;
  }

  async getProfile(teacherId: string): Promise<ITeacher | null> {
    const teacher = await this._teacherRepository.findById(teacherId);
    if (!teacher) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return teacher;
  }


  // Helper for Cloudinary upload
  private async uploadToCloudinary(file: Express.Multer.File, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto', folder }, (error, result) => {
        if (error || !result) reject(error || new Error('Upload failed'));
        else resolve(result.secure_url);
      }).end(file.buffer);
    });
  }

  async sendVerificationRequest(teacherId: string, file: Express.Multer.File): Promise<ITeacher> {
    const teacher = await this._teacherRepository.findById(teacherId);
    if (!teacher) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    if (teacher.verificationStatus === VerificationStatus.VERIFIED)
      throwError(MESSAGES.ALREADY_VERIFIED, STATUS_CODES.CONFLICT);
    if (teacher.verificationStatus === VerificationStatus.PENDING)
      throwError(MESSAGES.ALREADY_REQUESTED_VERIFICATION, STATUS_CODES.CONFLICT);
    // Check profile completeness (optional based on requirements, but user mentioned it)
    // const isComplete = await this._teacherRepository.isProfileComplete(teacherId);
    // if (!isComplete) throwError(MESSAGES.COMPLETE_PROFILE, STATUS_CODES.BAD_REQUEST);
    let resumeUrl = teacher.resumeUrl || '';
    if (file) {
      resumeUrl = await this.uploadToCloudinary(file, 'teacher_resumes');
    }
    // Set to PENDING, not VERIFIED
    const updated = await this._teacherRepository.sendVerificationRequest(teacherId, VerificationStatus.PENDING, resumeUrl);

    if (!updated) throwError(MESSAGES.VERIFICATION_FAILED, STATUS_CODES.BAD_REQUEST);

    return updated;
  }

  async changePassword(teacherId: string, currentPassword: string, newPassword: string): Promise<void> {
    const teacher = await this._teacherRepository.findById(teacherId);
    if (!teacher) throwError(MESSAGES.TEACHER_NOT_FOUND);

    const isMatch = await bcrypt.compare(currentPassword, teacher.password!);
    if (!isMatch) throwError(MESSAGES.PASSWORD_INCORRECT, STATUS_CODES.BAD_REQUEST);

    if (currentPassword === newPassword) {
      throwError(MESSAGES.NEW_PASSWORD_SAME_AS_OLD, STATUS_CODES.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._teacherRepository.updateById(teacherId, { password: hashedPassword });
  }

  @inject(TYPES.OtpRepository) private _otpRepo!: IOtpRepository;

  async requestEmailChange(teacherId: string, newEmail: string): Promise<void> {
    const existing = await this._teacherRepository.findByEmail(newEmail);
    if (existing) throwError('Email already in use', STATUS_CODES.BAD_REQUEST);

    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this._otpRepo.deleteByEmail(newEmail, 'change-email');
    await this._otpRepo.create({
      email: newEmail,
      otp,
      expiresAt,
      purpose: 'change-email'
    });

    await sendOtpEmail(newEmail, otp);
  }

  async verifyEmailChangeOtp(teacherId: string, newEmail: string, otp: string): Promise<void> {
    const otpRecord = await this._otpRepo.findByEmail(newEmail, 'change-email');
    if (!otpRecord) throwError('OTP not found or expired', STATUS_CODES.BAD_REQUEST);
    if (otpRecord.otp !== otp) throwError('Invalid OTP', STATUS_CODES.BAD_REQUEST);

    const existing = await this._teacherRepository.findByEmail(newEmail);
    if (existing) throwError('Email already in use', STATUS_CODES.BAD_REQUEST);

    await this._teacherRepository.updateById(teacherId, { email: newEmail });
    await this._otpRepo.deleteByEmail(newEmail, 'change-email');
  }
}

