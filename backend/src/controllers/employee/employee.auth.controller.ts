// src/controllers/employee/employee.auth.controller.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IEmployeeAuthService } from '../../core/interfaces/services/employee/IEmployeeAuthService';
import { TYPES } from '../../core/di/types';
import { setTokensInCookies, clearTokens } from '../../utils/JWTtoken';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { IEmployeeAuthController } from '../../core/interfaces/controllers/employee/IEmployeeAuthController';
import logger from '../../utils/logger';


@injectable()
export class EmployeeAuthController implements IEmployeeAuthController {
  constructor(@inject(TYPES.EmployeeAuthService) private readonly _employeeAuthService: IEmployeeAuthService) { }

  signup = async (req: Request, res: Response) => {
    
    if (!req.body.email) throwError(MESSAGES.EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._employeeAuthService.sendOtp(req.body);
    return sendResponse(res, STATUS_CODES.CREATED, MESSAGES.OTP_SENT, true);
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) throwError(MESSAGES.EMAIL_OTP_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const { token, refreshToken, user } = await this._employeeAuthService.verifyOtp(email, otp);
    setTokensInCookies(res, token, refreshToken);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_VERIFIED, true, user);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) throwError(MESSAGES.EMAIL_PASSWORD_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const { token, refreshToken, user } = await this._employeeAuthService.login(email, password);
    setTokensInCookies(res, token, refreshToken);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGIN_SUCCESS, true, user);
  };

  logout = async (_req: Request, res: Response) => {
    clearTokens(res);
     logger.info('logout successfull ');
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGOUT_SUCCESS, true);
  };

  googleAuth = async (req: Request, res: Response) => {
    console.log("employee side google login is working")
    const {  tokenId  } = req.body;
     console.log('tokenId',tokenId);
    if (!tokenId) throwError(MESSAGES.GOOGLE_AUTH_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const result = await this._employeeAuthService.googleAuth(tokenId);
    setTokensInCookies(res, result.token, result.refreshToken);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.GOOGLE_AUTH_SUCCESS, true, result.user);
  };

  sendForgotPasswordOtp = async (req: Request, res: Response) => {
    if (!req.body.email) throwError(MESSAGES.EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._employeeAuthService.sendForgotPasswordOtp(req.body.email);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_SENT, true);
  };

  verifyForgotOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) throwError(MESSAGES.EMAIL_OTP_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._employeeAuthService.verifyForgotOtp(email, otp);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_VERIFIED, true);
  };

  setNewPassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) throwError(MESSAGES.EMAIL_PASSWORD_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._employeeAuthService.setNewPassword(email, newPassword);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PASSWORD_RESET_SUCCESS, true);
  };

  resendOtp = async (req: Request, res: Response) => {
    const { email, purpose } = req.body;
    if (!email || !purpose) throwError(MESSAGES.EMAIL_PURPOSE_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._employeeAuthService.resendOtp(email, purpose);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_RESENT, true);
  };





}
