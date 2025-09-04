import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ICompanyAuthService } from '../../core/interfaces/services/company/ICompanyAuthService';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { setTokensInCookies, clearTokens } from '../../utils/JWTtoken';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { ICompanyAuthController } from '../../core/interfaces/controllers/company/ICompanyAuthController';

@injectable()
export class CompanyAuthController implements ICompanyAuthController{
  constructor(
    @inject(TYPES.CompanyAuthService) private readonly _companyService: ICompanyAuthService
  ) {}

  async sendOtp(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throwError(MESSAGES.ALL_FIELDS_REQUIRED, STATUS_CODES.BAD_REQUEST);
    }
    await this._companyService.sendOtp({ name, email, password });
    sendResponse(res, STATUS_CODES.CREATED, MESSAGES.OTP_SENT, true);
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    console.log('verifying otp ',req.body);
    const { email, otp } = req.body;
    
    if (!email || !otp) throwError(MESSAGES.ALL_FIELDS_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const company = await this._companyService.verifyOtp(email, otp);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_VERIFIED, true, company);
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password) throwError(MESSAGES.ALL_FIELDS_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const { token, refreshToken, company } = await this._companyService.login(email, password);
    setTokensInCookies(res, token, refreshToken);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGIN_SUCCESS, true, company);
  }

  async logout(req: Request, res: Response): Promise<void> {
    clearTokens(res);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGOUT_SUCCESS, true);
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    if (!email) throwError(MESSAGES.EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._companyService.forgotPassword(email);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_SENT, true);
  }

  async verifyForgotOtp(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    if (!email || !otp) throwError(MESSAGES.ALL_FIELDS_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._companyService.verifyForgotOtp(email, otp);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_VERIFIED, true);
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      throwError(MESSAGES.ALL_FIELDS_REQUIRED, STATUS_CODES.BAD_REQUEST);
    }
    await this._companyService.resetPassword(email, newPassword);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.PASSWORD_RESET_SUCCESS, true);
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    if (!email) throwError(MESSAGES.EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);
    await this._companyService.resendForgotPasswordOtp(email);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_RESENT, true);
  }

}
