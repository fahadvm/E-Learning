import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { ITeacherAuthService } from '../../core/interfaces/services/teacher/ITeacherAuthService';
import { ITeacherRepository } from '../../core/interfaces/repositories/ITeacherRepository';
import { IOtpRepository } from '../../core/interfaces/repositories/admin/IOtpRepository';
import { ITeacher } from '../../models/Teacher';
import { throwError } from '../../utils/ResANDError';
import { generateAccessToken, generateRefreshToken } from '../../utils/JWTtoken';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { generateOtp, sendOtpEmail } from '../../utils/OtpServices';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';

@injectable()
export class TeacherAuthService implements ITeacherAuthService {
  constructor(
    @inject(TYPES.TeacherRepository) private _teacherRepo: ITeacherRepository,
    @inject(TYPES.OtpRepository) private _otpRepository: IOtpRepository
  ) { }

  async sendOtp(data: ITeacher): Promise<void> {
    const { email, password, name } = data;
    if (!email || !password || !name) throwError(MESSAGES.ALL_FIELDS_REQUIRED, STATUS_CODES.BAD_REQUEST);
    if (await this._teacherRepo.findByEmail(email)) throwError(MESSAGES.TEACHER_ALREADY_EXISTS, STATUS_CODES.CONFLICT);

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const otpData = { email, otp, expiresAt, purpose: 'signup' as const, tempUserData: { name, password: hashedPassword } };
    const existingOtp = await this._otpRepository.findByEmail(email);

    existingOtp
      ? await this._otpRepository.updateOtp(email, otp, expiresAt, 'signup', otpData.tempUserData)
      : await this._otpRepository.create(otpData);

    await sendOtpEmail(email, otp);
  }

  async resendOtp(email: string, purpose: 'signup' | 'forgot-password'): Promise<void> {
    const existing = await this._otpRepository.findByEmail(email);
    if (!existing) throwError(MESSAGES.NO_OTP_FOUND, STATUS_CODES.NOT_FOUND);
    if (existing.purpose !== purpose) throwError(MESSAGES.OTP_PURPOSE_MISMATCH, STATUS_CODES.BAD_REQUEST);

    const newOtp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await this._otpRepository.updateOtp(email, newOtp, expiresAt);
    await sendOtpEmail(email, newOtp);
  }

  async verifyOtp(email: string, otp: string) {
    const record = await this._otpRepository.findByEmail(email);
    if (!record) throwError(MESSAGES.NO_OTP_FOUND, STATUS_CODES.NOT_FOUND);
    if (record.otp !== otp || record.expiresAt < new Date()) throwError(MESSAGES.OTP_INVALID, STATUS_CODES.BAD_REQUEST);
    if (!record.tempUserData) throwError(MESSAGES.TEMP_USER_DATA_MISSING, STATUS_CODES.BAD_REQUEST);

    const { name, password } = record.tempUserData;
    const teacher = await this._teacherRepo.create({ name, email, password,  isBlocked: false });
    await this._otpRepository.deleteByEmail(email);
    const teacherId = teacher?._id.toString();


    const token = generateAccessToken(teacherId, 'teacher');
    const refreshToken = generateRefreshToken(teacherId, 'teacher');
    return { token, refreshToken, user: { id: teacherId, role: 'teacher', email: teacher.email, name: teacher.name } };
  }

  async login(email: string, password: string) {
    const teacher = await this._teacherRepo.findByEmail(email);
    if (!teacher) throwError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.BAD_REQUEST);
    if (teacher.password && !(await bcrypt.compare(password, teacher.password))) throwError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.BAD_REQUEST);
    if (teacher.isBlocked) throwError(MESSAGES.ACCOUNT_BLOCKED, STATUS_CODES.FORBIDDEN);
    const teacherId = teacher?._id.toString();

    const token = generateAccessToken(teacherId, 'teacher');
    const refreshToken = generateRefreshToken(teacherId, 'teacher');
    return { token, refreshToken, user: { id: teacherId, role: 'teacher', email: teacher.email, name: teacher.name } };
  }

  // async googleAuth(profile: GooglePayLoad) {
  //   if (!profile.email || !profile.googleId) throwError(MESSAGES.INVALID_GOOGLE_DATA, STATUS_CODES.BAD_REQUEST);

  //   let user = await this._teacherRepo.findOne({ email: profile.email });
  //   if (!user) {
  //     user = await this._teacherRepo.create({
  //       name: profile.username, email: profile.email, googleId: profile.googleId, profilePicture: profile.image,
  //       role: "teacher", googleUser: true, isVerified: true
  //     });
  //   } else if (!user.googleUser) {
  //     user = await this._teacherRepo.updateById(user.id, {
  //       name: profile.username, email: profile.email, googleId: profile.googleId, role: "teacher", googleUser: true, isVerified: true
  //     });
  //   }
  //   if (user.isBlocked) throwError(MESSAGES.ACCOUNT_BLOCKED, STATUS_CODES.FORBIDDEN);

  //   const token = generateAccessToken(user.id, user.role);
  //   const refreshToken = generateRefreshToken(user.id, user.role);
  //   return { token, refreshToken, user: { id: user.id, role: user.role } };
  // }

  // async handleGoogleSignup(idToken: string) {
  //   const profile = await verifyGoogleIdToken(idToken);
  //   const { token, user } = await this._googleAuth(profile);
  //   return { user, token };
  // }

  async sendForgotPasswordOtp(email: string): Promise<void> {
    const teacher = await this._teacherRepo.findByEmail(email);
    if (!teacher) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const existingOtp = await this._otpRepository.findByEmail(email);

    existingOtp
      ? await this._otpRepository.updateOtp(email, otp, expiresAt, 'forgot-password')
      : await this._otpRepository.create({ email, otp, expiresAt, purpose: 'forgot-password' });

    await sendOtpEmail(email, otp);
  }

  async verifyForgotOtp(email: string, otp: string): Promise<void> {
    const record = await this._otpRepository.findByEmail(email);
    if (!record || record.purpose !== 'forgot-password') throwError(MESSAGES.NO_OTP_FOUND, STATUS_CODES.NOT_FOUND);
    if (record.otp !== otp || record.expiresAt < new Date()) throwError(MESSAGES.OTP_INVALID, STATUS_CODES.UNAUTHORIZED);
  }

  async setNewPassword(email: string, newPassword: string): Promise<void> {
    const teacher = await this._teacherRepo.findByEmail(email);
    if (!teacher) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._teacherRepo.updateByEmail(email, { password: hashedPassword });
    await this._otpRepository.deleteByEmail(email);
  }

 

}
