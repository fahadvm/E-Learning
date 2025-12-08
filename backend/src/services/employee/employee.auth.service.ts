import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { IEmployeeAuthService } from '../../core/interfaces/services/employee/IEmployeeAuthService';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';
import { IOtpRepository } from '../../core/interfaces/repositories/admin/IOtpRepository';
import { IEmployee } from '../../models/Employee';
import { throwError } from '../../utils/ResANDError';
import { generateAccessToken, generateRefreshToken } from '../../utils/JWTtoken';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { generateOtp, sendOtpEmail } from '../../utils/OtpServices';
import { OAuth2Client } from 'google-auth-library';
import { TYPES } from '../../core/di/types';
import { MESSAGES } from '../../utils/ResponseMessages';

const GOOGLE_CLIENT_ID = '1009449170165-l51vq71vru9hqefmkl570nf782455uf1.apps.googleusercontent.com';

@injectable()
export class EmployeeAuthService implements IEmployeeAuthService {
  private _googleClient: OAuth2Client;

  constructor(
    @inject(TYPES.EmployeeRepository) private _employeeRepo: IEmployeeRepository,
    @inject(TYPES.OtpRepository) private _otpRepo: IOtpRepository
  ) {
    this._googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
  }

  private async handleOtp(
    email: string,
    purpose: 'signup' | 'forgot-password' | 'change-email',
    tempUserData?: { name: string; password: string }
  ) {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const existingOtp = await this._otpRepo.findByEmail(email);
    if (existingOtp) await this._otpRepo.updateOtp(email, otp, expiresAt, pur pose, tempUserData);
    else await this._otpRepo.create({ email, otp, expiresAt, purpose, tempUserData });
    await sendOtpEmail(email, otp);
  }

  async sendOtp(data: IEmployee): Promise<void> {
    const { email, name, password } = data;
    if (!email || !name || !password) throwError(MESSAGES.ALL_FIELDS_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const existingEmployee = await this._employeeRepo.findByEmail(email);
    if (existingEmployee) throwError(MESSAGES.STUDENT_ALREADY_EXISTS, STATUS_CODES.CONFLICT);

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
    if (!record || record.otp !== otp || record.expiresAt < new Date())
      throwError(MESSAGES.OTP_INVALID, STATUS_CODES.BAD_REQUEST);
    if (!record.tempUserData) throwError(MESSAGES.TEMP_USER_DATA_MISSING, STATUS_CODES.BAD_REQUEST);

    const { name, password } = record.tempUserData;
    const employee = await this._employeeRepo.create({
      name,
      email,
      password,
      isVerified: true,
      isBlocked: false
    });

    await this._otpRepo.deleteByEmail(email);

    const token = generateAccessToken(employee._id.toString(), 'employee');
    const refreshToken = generateRefreshToken(employee._id.toString(), 'employee');
    let streak = await this._employeeRepo.updateLoginStreak(employee._id.toString());
    console.log("streak :", streak)
    if (!streak) throwError(MESSAGES.STREAK_FAILED, STATUS_CODES.BAD_REQUEST)

    return {
      token,
      refreshToken,
      user: { id: employee._id.toString(), role: 'employee', email: employee.email, name: employee.name }
    };
  }

  async login(email: string, password: string) {
    const employee = await this._employeeRepo.findByEmail(email);
    if (!employee || !employee.password) throwError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.BAD_REQUEST);

    const match = await bcrypt.compare(password, employee.password);
    if (!match) throwError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.BAD_REQUEST);
    if (!employee.isVerified) throwError(MESSAGES.VERIFY_EMAIL, STATUS_CODES.UNAUTHORIZED);
    if (employee.isBlocked) throwError(MESSAGES.ACCOUNT_BLOCKED, STATUS_CODES.FORBIDDEN);

    const token = generateAccessToken(employee._id.toString(), 'employee');
    const refreshToken = generateRefreshToken(employee._id.toString(), 'employee');

    let streak = await this._employeeRepo.updateLoginStreak(employee._id.toString());
    if (!streak) throwError(MESSAGES.STREAK_FAILED, STATUS_CODES.BAD_REQUEST)


    return {
      token,
      refreshToken,
      user: { id: employee._id.toString(), role: 'employee', email: employee.email, name: employee.name }
    };
  }

  async googleAuth(idToken: string) {
    const ticket = await this._googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload) throwError(MESSAGES.GOOGLE_TOKEN_INVALID, STATUS_CODES.BAD_REQUEST);

    const { sub: googleId, email, name } = payload;
    if (!googleId || !email) throwError(MESSAGES.GOOGLE_TOKEN_MISSING_FIELDS, STATUS_CODES.BAD_REQUEST);

    let user = await this._employeeRepo.findByGoogleId(googleId);
    if (!user) user = await this._employeeRepo.findByEmail(email);

    if (!user) {
      user = await this._employeeRepo.create({
        googleId,
        email,
        name,
        isVerified: true,
        isBlocked: false,
        role: 'employee'
      });
    } else if (!user.googleId) {
      throwError(MESSAGES.USER_NOT_LINKED_GOOGLE, STATUS_CODES.BAD_REQUEST);
    }

    const token = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);
    let streak = await this._employeeRepo.updateLoginStreak(user._id.toString());
    if (!streak) throwError(MESSAGES.STREAK_FAILED, STATUS_CODES.BAD_REQUEST)
    return {
      token,
      refreshToken,
      user: { id: user._id.toString(), role: 'employee' }
    };
  }

  async sendForgotPasswordOtp(email: string) {
    const employee = await this._employeeRepo.findByEmail(email);
    if (!employee) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    await this.handleOtp(email, 'forgot-password');
  }

  async verifyForgotOtp(email: string, otp: string) {
    const record = await this._otpRepo.findByEmail(email);
    if (!record || record.purpose !== 'forgot-password') throwError(MESSAGES.OTP_NOT_VALID, STATUS_CODES.BAD_REQUEST);
    if (record.otp !== otp || record.expiresAt < new Date()) throwError(MESSAGES.OTP_INVALID, STATUS_CODES.BAD_REQUEST);
  }

  async setNewPassword(email: string, newPassword: string) {
    const employee = await this._employeeRepo.findByEmail(email);
    if (!employee) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._employeeRepo.updateByEmail(email, { password: hashedPassword });
    await this._otpRepo.deleteByEmail(email);
  }

  async sendChangeEmailOtp(employeeId: string, newEmail: string) {
    const existing = await this._employeeRepo.findByEmail(newEmail);
    if (existing) throwError("Email already in use.", STATUS_CODES.CONFLICT);

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const existingOtp = await this._otpRepo.findByEmail(newEmail);
    if (existingOtp) await this._otpRepo.updateOtp(newEmail, otp, expiresAt, "change-email");
    else await this._otpRepo.create({ email: newEmail, otp, expiresAt, purpose: "change-email" });

    await sendOtpEmail(newEmail, otp);
  }

  async verifyChangeEmail(employeeId: string, newEmail: string, otp: string) {
    const record = await this._otpRepo.findByEmail(newEmail);
    if (!record || record.purpose !== "change-email") throwError("OTP not valid", STATUS_CODES.BAD_REQUEST);
    if (record.otp !== otp || record.expiresAt < new Date()) throwError("Invalid OTP", STATUS_CODES.BAD_REQUEST);

    await this._employeeRepo.updateById(employeeId, { email: newEmail });
    await this._otpRepo.deleteByEmail(newEmail);
  }

  async changePassword(employeeID: string, oldPassword: string, newPassword: string) {
    const employee = await this._employeeRepo.findById(employeeID);
    if (!employee) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const match = await bcrypt.compare(oldPassword, employee.password);
    if (!match) throwError("Old password incorrect", STATUS_CODES.BAD_REQUEST);

    const hashed = await bcrypt.hash(newPassword, 10);
    await this._employeeRepo.updateById(employeeID, { password: hashed });
  }

}
