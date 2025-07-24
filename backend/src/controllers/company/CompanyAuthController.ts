import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { ICompanyAuthService } from "../../core/interfaces/services/company/ICompanyAuthService";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { setTokensInCookies, clearTokens } from "../../utils/JWTtoken";

@injectable()
export class CompanyAuthController {
  constructor(
    @inject("CompanyAuthService") private companyService: ICompanyAuthService
  ) {}

  async sendOtp(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        throwError("Name, email, and password are required", STATUS_CODES.BAD_REQUEST);
      }

      await this.companyService.sendOtp({ name, email, password });
      sendResponse(res, STATUS_CODES.CREATED, `OTP sent to ${email}`, true);
    } catch (err) {
      handleControllerError(res, err);
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        throwError("Email and OTP are required", STATUS_CODES.BAD_REQUEST);
      }

      const company = await this.companyService.verifyOtp(email, otp);
      sendResponse(res, STATUS_CODES.OK, "OTP verified and company created", true, company);
    } catch (err) {
      handleControllerError(res, err);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throwError("Email and password are required", STATUS_CODES.BAD_REQUEST);
      }

      const { token, refreshToken, company } = await this.companyService.login(email, password);
      setTokensInCookies(res, token, refreshToken);
      sendResponse(res, STATUS_CODES.OK, "Login successful", true, company);
    } catch (err) {
      handleControllerError(res, err);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      clearTokens(res);
      sendResponse(res, STATUS_CODES.OK, "Logged out successfully", true);
    } catch (err) {
      handleControllerError(res, err);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) throwError("Email is required", STATUS_CODES.BAD_REQUEST);

      await this.companyService.forgotPassword(email);
      sendResponse(res, STATUS_CODES.OK, `OTP sent to ${email} for password reset`, true);
    } catch (err) {
      handleControllerError(res, err);
    }
  }

  async verifyForgotOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) throwError("Email and OTP are required", STATUS_CODES.BAD_REQUEST);

      await this.companyService.verifyForgotOtp(email, otp);
      sendResponse(res, STATUS_CODES.OK, "OTP verified", true);
    } catch (err) {
      handleControllerError(res, err);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email,  newPassword } = req.body;
      if (!email || !newPassword) {
        throwError("Email,  and new password are required", STATUS_CODES.BAD_REQUEST);
      }

      await this.companyService.resetPassword(email, newPassword);
      sendResponse(res, STATUS_CODES.OK, "Password reset successful", true);
    } catch (err) {
      handleControllerError(res, err);
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) throwError("Email is required", STATUS_CODES.BAD_REQUEST);

      await this.companyService.resendForgotPasswordOtp(email);
      sendResponse(res, STATUS_CODES.OK, "OTP resent successfully", true);
    } catch (err) {
      handleControllerError(res, err);
    }
  }
}
