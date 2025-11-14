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
}
