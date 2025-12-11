import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { decodeToken } from '../../utils/JWTtoken';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { ICompanyProfileService } from '../../core/interfaces/services/company/ICompanyProfileService';
import { ICompanyProfileController } from '../../core/interfaces/controllers/company/ICompanyProfileController';

@injectable()
export class CompanyProfileController implements ICompanyProfileController {
  constructor(
    @inject(TYPES.CompanyProfileService)
    private readonly _companyService: ICompanyProfileService
  ) {}

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
      throwError(MESSAGES.CERTIFICATE_AND_TAXID_REQUIRED, STATUS_CODES.BAD_REQUEST);
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

    const updatedCompany = await this._companyService.updateProfile(decoded.id, req.body);

    sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPANY_UPDATED, true, updatedCompany);
  }

  // Send OTP for Email Change
  async sendEmailChangeOTP(req: Request, res: Response): Promise<void> {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { newEmail } = req.body;
    if (!newEmail) throwError(MESSAGES.EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throwError(MESSAGES.INVALID_EMAIL_FORMAT, STATUS_CODES.BAD_REQUEST);
    }

    await this._companyService.sendEmailChangeOTP(decoded.id, newEmail);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.OTP_SENT_NEW_EMAIL, true, null);
  }

  // Verify OTP for Email Change
  async verifyEmailChangeOTP(req: Request, res: Response): Promise<void> {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { newEmail, otp } = req.body;
    if (!newEmail || !otp) {
      throwError(MESSAGES.EMAIL_AND_OTP_REQUIRED, STATUS_CODES.BAD_REQUEST);
    }

    const updated = await this._companyService.verifyEmailChangeOTP(decoded.id, newEmail, otp);

    sendResponse(res, STATUS_CODES.OK, MESSAGES.EMAIL_UPDATED_SUCCESS, true, updated);
  }

  // Change Password
  async changePassword(req: Request, res: Response): Promise<void> {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throwError(MESSAGES.PASSWORDS_REQUIRED, STATUS_CODES.BAD_REQUEST);
    }

    await this._companyService.changePassword(decoded.id, currentPassword, newPassword);

    sendResponse(res, STATUS_CODES.OK, MESSAGES.PASSWORD_CHANGED_SUCCESS, true, null);
  }
}
