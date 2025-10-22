// src/services/student/StudentAuthService.ts
import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { IStudentAuthService } from '../../core/interfaces/services/student/IStudentAuthService';
import { IStudentRepository } from '../../core/interfaces/repositories/IStudentRepository';
import { IOtpRepository } from '../../core/interfaces/repositories/admin/IOtpRepository';
import { IStudent } from '../../models/Student';
import { throwError } from '../../utils/ResANDError';
import { generateAccessToken, generateRefreshToken } from '../../utils/JWTtoken';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { generateOtp, sendOtpEmail } from '../../utils/OtpServices';
import { OAuth2Client } from 'google-auth-library';
import { TYPES } from '../../core/di/types';
import { MESSAGES } from '../../utils/ResponseMessages';
import logger from '../../utils/logger';
const GOOGLE_CLIENT_ID = '1009449170165-l51vq71vru9hqefmkl570nf782455uf1.apps.googleusercontent.com';


@injectable()
export class StudentAuthService implements IStudentAuthService {
  private _googleClient: OAuth2Client;
  constructor(
    @inject(TYPES.StudentRepository) private _studentRepo: IStudentRepository,
    @inject(TYPES.OtpRepository) private _otpRepo: IOtpRepository
  ) {
    this._googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
  }

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

async googleAuth(idToken: string): Promise<{
  token: string;
  refreshToken: string;
  user: { id: string; role: string };
}> {
  const ticket = await this._googleClient.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload) throw new Error('Invalid Google token payload');
   logger.debug('Expected Audience:', GOOGLE_CLIENT_ID);
 logger.debug('Actual Audience from token:', payload.aud);

  const { sub: googleId, email, name } = payload;
  if (!googleId || !email) throw new Error('Google token missing required fields');

  let user = await this._studentRepo.findByGoogleId(googleId);
  if (!user) user = await this._studentRepo.findByEmail(email);

  if (!user) {
    user = await this._studentRepo.create({
      googleId,
      email,
      name,
      isVerified: true,
      isBlocked: false,
      role: 'student',
    });
  } else if (!user.googleId) {
    throw new Error('User is not linked to Google');
  }

  const token = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString(), user.role);

  return {
    token, // matches interface
    refreshToken,
    user: {
      id: user._id.toString(),
      role: 'student', 
    },
  };
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
