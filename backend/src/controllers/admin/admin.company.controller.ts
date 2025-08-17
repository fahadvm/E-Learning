import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/DI/types';
import { IAdminCompanyService } from '../../core/interfaces/services/admin/IAdminCompanyService';
import { Request, Response } from 'express';
import { sendResponse } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { validatePagination } from '../../utils/validatePagination';

@injectable()
export class AdminCompanyController {
    constructor(
        @inject(TYPES.AdminCompanyService)
        private readonly _companyService: IAdminCompanyService
    ) { }

    async getAllCompanies(req: Request, res: Response): Promise<void> {
         const { page = '1', limit = '10', search = '' } = req.query;
        const { pageNum, limitNum, error } = validatePagination(String(page), String(limit));

        if (error || pageNum === null || limitNum === null) {
            return sendResponse(res, STATUS_CODES.BAD_REQUEST, error, false);
        }

        const result = await this._companyService.getAllCompanies(
            pageNum,
            limitNum,
            String(search || '')
        );

        sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPANIES_FETCHED, true, result);
    }

    async getUnverifiedCompanies(req: Request, res: Response): Promise<void> {
        const { page = '1', limit = '10', search = '' } = req.query;
        const { pageNum, limitNum, error } = validatePagination(String(page), String(limit));
        if (error || pageNum === null || limitNum === null) {
            return sendResponse(res, STATUS_CODES.BAD_REQUEST, error, false);
        }
        const companies = await this._companyService.getUnverifiedCompanies(
            pageNum,
            limitNum,
            String(search || '')
        );
        sendResponse(res, STATUS_CODES.OK, MESSAGES.UNVERIFIED_COMPANIES_FETCHED, true, companies);
    }
    async verifyCompany(req: Request, res: Response): Promise<void> {
        const { companyId } = req.params;
        const updatedCompany = await this._companyService.verifyCompany(companyId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.VERIFIED, true, updatedCompany);
    }

    async getCompayById(req: Request, res: Response): Promise<void> {
        const { companyId } = req.params;
        const company = await this._companyService.getCompanyById(companyId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPANY_DETAILS_FETCHED, true, company);
    }


    async rejectCompany(req: Request, res: Response): Promise<void> {
        const { companyId } = req.params;
        const { rejectReason } = req.body;
        const updatedCompany = await this._companyService.rejectCompany(companyId, rejectReason);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.REJECTED, true, updatedCompany);
    }

    async blockCompany(req: Request, res: Response): Promise<void> {
        const { companyId } = req.params;
        const updatedCompany = await this._companyService.blockCompany(companyId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPANY_BLOCKED, true, updatedCompany);
    }

    async unblockCompany(req: Request, res: Response): Promise<void> {
        const { companyId } = req.params;
        const updatedCompany = await this._companyService.unblockCompany(companyId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPANY_UNBLOCKED, true, updatedCompany);
    }

    async approveAllCompanies(req: Request, res: Response): Promise<void> {
        const updatedCompany = await this._companyService.approveAllCompanies();
        sendResponse(res, STATUS_CODES.OK, MESSAGES.APPROVED, true, updatedCompany);
    }

    async rejectAllCompanies(req: Request, res: Response): Promise<void> {
        const { rejectReason } = req.body;
        const updatedCompany = await this._companyService.rejectAllCompanies(rejectReason);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.REJECTED, true, updatedCompany);
    }
}
