// src/services/student/StudentAuthService.ts
import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { IStudentAuthService } from '../../core/interfaces/services/student/IStudentAuthService';
import { IStudentRepository } from '../../core/interfaces/repositories/student/IStudentRepository';
import { IOtpRepository } from '../../core/interfaces/repositories/common/IOtpRepository';
import { IStudent } from '../../models/Student';
import { throwError } from '../../utils/ResANDError';
import { generateAccessToken, generateRefreshToken } from '../../utils/JWTtoken';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { generateOtp, sendOtpEmail } from '../../utils/OtpServices';
import { GooglePayLoad } from '../../types/userTypes';
import { verifyGoogleIdToken } from '../../utils/googleVerify';
import { TYPES } from '../../core/di/types';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class StudentAuthService implements IStudentAuthService {
  constructor(
    @inject(TYPES.StudentRepository) private _studentRepo: IStudentRepository,
    @inject(TYPES.OtpRepository) private _otpRepo: IOtpRepository
  ) {}

  private async handleOtp(email: string, purpose: 'signup' | 'forgot-password', tempUserData?: { name: string; password: string; }) {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const existingOtp = await this._otpRepo.findByEmail(email);
    if (existingOtp) await this._otpRepo.updateOtp(email, otp, expiresAt, purpose, tempUserData);
    else await this._otpRepo.create({ email, otp, expiresAt, purpose, tempUserData });
    await sendOtpEmail(email, otp);
  }

  async sendOtp(data: IStudent): Promise<void> {
    const { email, name, password } = data;
    if (!email || !name || !password) throwError(MESSAGES.ALL_FIELDS_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const existingStudent = await this._studentRepo.findByEmail(email);
    if (existingStudent) throwError(MESSAGES.STUDENT_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.handleOtp(email, 'signup', { name, password: hashedPassword });
  }

  async resendOtp(email: string, purpose: 'signup' | 'forgot-password'): Promise<void> {
    const existing = await this._otpRepo.findByEmail(email);
    if (!existing) throwError(MESSAGES.NO_OTP_FOUND, STATUS_CODES.NOT_FOUND);
    if (existing.purpose !== purpose) throwError(MESSAGES.OTP_PURPOSE_MISMATCH, STATUS_CODES.BAD_REQUEST);
    await this.handleOtp(email, purpose);
  }

  async verifyOtp(email: string, otp: string) {
    const record = await this._otpRepo.findByEmail(email);
    if (!record || record.otp !== otp || record.expiresAt < new Date()) throwError(MESSAGES.OTP_INVALID, STATUS_CODES.BAD_REQUEST);
    if (!record.tempUserData) throwError(MESSAGES.TEMP_USER_DATA_MISSING, STATUS_CODES.BAD_REQUEST);
    const { name, password } = record.tempUserData;
    const student = await this._studentRepo.create({ name, email, password, isVerified: true, isBlocked: false });
    await this._otpRepo.deleteByEmail(email);
    const token = generateAccessToken(student._id.toString(), 'student');
    const refreshToken = generateRefreshToken(student._id.toString(), 'student');
    return { token, refreshToken, user: { id: student._id.toString(), role: 'student', email: student.email, name: student.name } };
  }

  async login(email: string, password: string) {
    const student = await this._studentRepo.findByEmail(email);
    if (!student || !student.password) throwError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.BAD_REQUEST);
    const match = await bcrypt.compare(password, student.password);
    if (!match) throwError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.BAD_REQUEST);
    if (!student.isVerified) throwError(MESSAGES.VERIFY_EMAIL, STATUS_CODES.UNAUTHORIZED);
    if (student.isBlocked) throwError(MESSAGES.ACCOUNT_BLOCKED, STATUS_CODES.FORBIDDEN);
    const token = generateAccessToken(student._id.toString(), 'student');
    const refreshToken = generateRefreshToken(student._id.toString(), 'student');
    return { token, refreshToken, user: { id: student._id.toString(), role: 'student', email: student.email, name: student.name } };
  }

  async googleAuth(profile: GooglePayLoad) {
    if (!profile.email || !profile.googleId) throwError(MESSAGES.INVALID_PROFILE_DATA, STATUS_CODES.BAD_REQUEST);
    let user = await this._studentRepo.findOne({ email: profile.email });
    if (!user) {
      user = await this._studentRepo.create({
        name: profile.username, email: profile.email, googleId: profile.googleId,
        profilePicture: profile.image, role: 'student', googleUser: true, isVerified: true
      });
    } else if (!user.googleUser) {
      user = await this._studentRepo.update(user.id, {
        name: profile.username, email: profile.email, googleId: profile.googleId, googleUser: true, isVerified: true
      });
    }
    if (user.isBlocked) throwError(MESSAGES.USER_BLOCKED, STATUS_CODES.FORBIDDEN);
    const token = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);
    return { token, refreshToken, user: { id: user.id, role: user.role } };
  }

  async handleGoogleSignup(idToken: string) {
    const profile = await verifyGoogleIdToken(idToken);
    const { token, user } = await this.googleAuth(profile);
    return { user, token };
  }

  async sendForgotPasswordOtp(email: string) {
    const student = await this._studentRepo.findByEmail(email);
    if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    await this.handleOtp(email, 'forgot-password');
  }

  async verifyForgotOtp(email: string, otp: string) {
    const record = await this._otpRepo.findByEmail(email);
    if (!record || record.purpose !== 'forgot-password') throwError(MESSAGES.OTP_NOT_VALID, STATUS_CODES.BAD_REQUEST);
    if (record.otp !== otp || record.expiresAt < new Date()) throwError(MESSAGES.OTP_INVALID, STATUS_CODES.BAD_REQUEST);
  }

  async setNewPassword(email: string, newPassword: string) {
    const student = await this._studentRepo.findByEmail(email);
    if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._studentRepo.updateByEmail(email, { password: hashedPassword });
    await this._otpRepo.deleteByEmail(email);
  }
}
