import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IStudentAuthService } from '../../core/interfaces/services/student/IStudentAuthService';
import { TYPES } from '../../core/di/types';
import { setTokensInCookies, clearTokens } from '../../utils/JWTtoken';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import logger from '../../utils/logger';
import { IStudentAuthController } from '../../core/interfaces/controllers/student/IStudentAuthController';
import { AuthRequest } from '../../types/AuthenticatedRequest';

@injectable()
export class StudentAuthController implements IStudentAuthController {
  constructor(
    @inject(TYPES.StudentAuthService)
    private readonly _studentAuthService: IStudentAuthService
  ) {}

  signup = async (req: Request, res: Response) => {
    if (!req.body.email) throwError(MESSAGES.EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._studentAuthService.sendOtp(req.body);
    return sendResponse(res, STATUS_CODES.CREATED, MESSAGES.OTP_SENT, true);
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) throwError(MESSAGES.EMAIL_OTP_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const { token, refreshToken, user } = await this._studentAuthService.verifyOtp(email, otp);
    setTokensInCookies(res, token, refreshToken);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_VERIFIED, true, user);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password)
      throwError(MESSAGES.EMAIL_PASSWORD_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const { token, refreshToken, user } = await this._studentAuthService.login(email, password);
    setTokensInCookies(res, token, refreshToken);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGIN_SUCCESS, true, user);
  };

  logout = async (_req: Request, res: Response) => {
    clearTokens(res);
    logger.info('student logout successful');
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGOUT_SUCCESS, true);
  };

  googleAuth = async (req: Request, res: Response) => {
    const { tokenId } = req.body;
    if (!tokenId) throwError(MESSAGES.GOOGLE_AUTH_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const result = await this._studentAuthService.googleAuth(tokenId);
    setTokensInCookies(res, result.token, result.refreshToken);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.GOOGLE_AUTH_SUCCESS, true, result.user);
  };

  sendForgotPasswordOtp = async (req: Request, res: Response) => {
    if (!req.body.email) throwError(MESSAGES.EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._studentAuthService.sendForgotPasswordOtp(req.body.email);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_SENT, true);
  };

  verifyForgotOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) throwError(MESSAGES.EMAIL_OTP_REQUIRED, STATUS_CODES.BAD_REQUEST);

    await this._studentAuthService.verifyForgotOtp(email, otp);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_VERIFIED, true);
  };

  setNewPassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      throwError(MESSAGES.EMAIL_PASSWORD_REQUIRED, STATUS_CODES.BAD_REQUEST);

    await this._studentAuthService.setNewPassword(email, newPassword);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PASSWORD_RESET_SUCCESS, true);
  };

  resendOtp = async (req: Request, res: Response) => {
    const { email, purpose } = req.body;
    if (!email || !purpose) throwError(MESSAGES.EMAIL_PURPOSE_REQUIRED, STATUS_CODES.BAD_REQUEST);

    await this._studentAuthService.resendOtp(email, purpose);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_RESENT, true);
  };

  changePassword = async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const studentId = req.user?.id;

    if (!studentId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.NOT_FOUND);
    if (!currentPassword || !newPassword)
      throwError(MESSAGES.CURRENT_NEW_PASSWORD_REQUIRED, STATUS_CODES.BAD_REQUEST);

    await this._studentAuthService.changePassword(studentId, currentPassword, newPassword);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PASSWORD_UPDATED_SUCCESS, true);
  };

  sendEmailChangeOtp = async (req: AuthRequest, res: Response) => {
    const { newEmail } = req.body;
    const studentId = req.user?.id;

    if (!studentId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.NOT_FOUND);
    if (!newEmail) throwError(MESSAGES.NEW_EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);

    await this._studentAuthService.sendEmailChangeOtp(studentId, newEmail);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_SENT_NEW_EMAIL, true);
  };

  verifyAndUpdateEmail = async (req: AuthRequest, res: Response) => {
    const { newEmail, otp } = req.body;
    const studentId = req.user?.id;

    if (!studentId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.NOT_FOUND);
    if (!newEmail || !otp)
      throwError(MESSAGES.EMAIL_OTP_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const updatedUser = await this._studentAuthService.verifyEmailChangeOtp(
      studentId,
      newEmail,
      otp
    );

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.EMAIL_UPDATED_SUCCESS, true, updatedUser);
  };
}
