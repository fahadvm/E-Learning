// src/controllers/teacher/teacher.auth.controller.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ITeacherAuthService } from '../../core/interfaces/services/teacher/ITeacherAuthService';
import { TYPES } from '../../core/di/types';
import { setTokensInCookies, clearTokens } from '../../utils/JWTtoken';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { ITeacherAuthController } from '../../core/interfaces/controllers/teacher/ITeacherAuthController';

@injectable()
export class TeacherAuthController implements ITeacherAuthController {
  constructor(
    @inject(TYPES.TeacherAuthService) private readonly _teacherAuthService: ITeacherAuthService
  ) {}

  signup = async (req: Request, res: Response) => {
    if (!req.body.email) throwError(MESSAGES.EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._teacherAuthService.sendOtp(req.body);
    return sendResponse(res, STATUS_CODES.CREATED, MESSAGES.OTP_SENT, true);
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) throwError(MESSAGES.EMAIL_OTP_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const { token, refreshToken, user } = await this._teacherAuthService.verifyOtp(email, otp);
    setTokensInCookies(res, token, refreshToken);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_VERIFIED, true, user);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) throwError(MESSAGES.EMAIL_PASSWORD_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const { token, refreshToken, user } = await this._teacherAuthService.login(email, password);
    setTokensInCookies(res, token, refreshToken);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGIN_SUCCESS, true, user);
  };

  logout = async (_req: Request, res: Response) => {
    clearTokens(res);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGOUT_SUCCESS, true);
  };

//   googleAuth = async (req: Request, res: Response) => {
//     const { email, googleId } = req.body;
//     if (!email || !googleId) throwError(MESSAGES.GOOGLE_AUTH_REQUIRED, STATUS_CODES.BAD_REQUEST);
//     const r = await this._teacherAuthService.googleAuth(req.body);
//     setTokensInCookies(res, r.token, r.refreshToken);
//     return sendResponse(res, STATUS_CODES.OK, MESSAGES.GOOGLE_AUTH_SUCCESS, true, r.user);
//   };

  sendForgotPasswordOtp = async (req: Request, res: Response) => {
    if (!req.body.email) throwError(MESSAGES.EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._teacherAuthService.sendForgotPasswordOtp(req.body.email);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_SENT, true);
  };

  verifyForgotOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) throwError(MESSAGES.EMAIL_OTP_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._teacherAuthService.verifyForgotOtp(email, otp);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_VERIFIED, true);
  };

  setNewPassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) throwError(MESSAGES.EMAIL_PASSWORD_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._teacherAuthService.setNewPassword(email, newPassword);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PASSWORD_RESET_SUCCESS, true);
  };

  resendOtp = async (req: Request, res: Response) => {
    const { email, purpose } = req.body;
    if (!email || !purpose) throwError(MESSAGES.EMAIL_PURPOSE_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._teacherAuthService.resendOtp(email, purpose);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_RESENT, true);
  };
}
