import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import {  decodeToken } from '../../utils/JWTtoken';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { ICompanyProfileService } from '../../core/interfaces/services/company/ICompanyProfileService';

@injectable()
export class CompanyProfileController {
  constructor(
    @inject(TYPES.CompanyProfileService) private readonly _companyService: ICompanyProfileService
  ) {}


  async getProfile(req: Request, res: Response): Promise<void> {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const company = await this._companyService.getProfile(decoded.id);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPANY_DETAILS_FETCHED, true, company);
  }
}
