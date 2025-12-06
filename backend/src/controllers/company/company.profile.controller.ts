import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { decodeToken } from '../../utils/JWTtoken';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { ICompanyProfileService } from '../../core/interfaces/services/company/ICompanyProfileService';
import { ICompanyProfileController } from '../../core/interfaces/controllers/company/ICompanyProfileController';
import cloudinary from '../../config/cloudinary';

@injectable()
export class CompanyProfileController implements ICompanyProfileController {
  constructor(
    @inject(TYPES.CompanyProfileService) private readonly _companyService: ICompanyProfileService
  ) { }

  async getProfile(req: Request, res: Response): Promise<void> {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const company = await this._companyService.getProfile(decoded.id);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPANY_DETAILS_FETCHED, true, company);
  }

  async verify(req: Request, res: Response): Promise<void> {
    const { name, address, phone, companyId, pincode } = req.body;

    const certificateFile = (req.files as any)?.certificate?.[0];
    const taxIdFile = (req.files as any)?.taxId?.[0];

    if (!certificateFile || !taxIdFile) {
      throwError("Both certificate & taxId are required", STATUS_CODES.BAD_REQUEST);
    }

    const verification = await this._companyService.requestVerification(
      companyId,
      name,
      address,
      pincode,
      phone,
      certificateFile,
      taxIdFile
    );

    sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.COMPANY_VERIFICATION_SUBMITTED,
      true,
      verification
    );
  }

  async updateProfile(req: Request, res: Response) {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const companyId = decoded.id;
    const updatedData = req.body;
    const updatedCompany = await this._companyService.updateProfile(companyId, updatedData);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPANY_UPDATED, true, updatedCompany);
  }

  // Email Change - Send OTP
  async sendEmailChangeOTP(req: Request, res: Response): Promise<void> {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { newEmail } = req.body;
    if (!newEmail) throwError("New email is required", STATUS_CODES.BAD_REQUEST);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throwError("Invalid email format", STATUS_CODES.BAD_REQUEST);
    }

    await this._companyService.sendEmailChangeOTP(decoded.id, newEmail);
    sendResponse(res, STATUS_CODES.OK, "OTP sent to new email address", true, null);
  }

  // Email Change - Verify OTP
  async verifyEmailChangeOTP(req: Request, res: Response): Promise<void> {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { newEmail, otp } = req.body;
    if (!newEmail || !otp) throwError("Email and OTP are required", STATUS_CODES.BAD_REQUEST);

    const updated = await this._companyService.verifyEmailChangeOTP(decoded.id, newEmail, otp);
    sendResponse(res, STATUS_CODES.OK, "Email updated successfully", true, updated);
  }

  // Change Password
  async changePassword(req: Request, res: Response): Promise<void> {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throwError("Current password and new password are required", STATUS_CODES.BAD_REQUEST);
    }

    await this._companyService.changePassword(decoded.id, currentPassword, newPassword);
    sendResponse(res, STATUS_CODES.OK, "Password changed successfully", true, null);
  }
}
