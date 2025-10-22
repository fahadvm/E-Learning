import {  Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { ICompanyPurchaseService } from '../../core/interfaces/services/company/ICompanyPurchaseService';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { ICompanyPurchaseController } from '../../core/interfaces/controllers/company/ICompanyPurchaseController';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
@injectable()
export class CompanyPurchaseController implements ICompanyPurchaseController {
    constructor(
        @inject(TYPES.CompanyPurchaseService)
        private _purchaseService: ICompanyPurchaseService
    ) { }

    async createCheckoutSession(req: AuthRequest, res: Response) {
        const { courses , amount} = req.body;
        console.log("courses ids in controller,",courses)
        const companyId = req.user?.id;

        const session = await this._purchaseService.createCheckoutSession(courses, companyId as string , amount);
        const data = { url: session.url };
        sendResponse(res, STATUS_CODES.OK, MESSAGES.PAYMENT_PAID_SUCCESSFULLY, true, data);

    }

    async verifyPayment(req: AuthRequest, res: Response) {
        const { sessionId } = req.body;
        const companyId = req.user?.id;
        if (!sessionId || !companyId) {
            throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);
        }
        const result = await this._purchaseService.verifyPayment(sessionId, companyId);
        if (result.success) {
           sendResponse(res,STATUS_CODES.OK,MESSAGES.PAYMENT_VERIFIED_SUCCESSFULLY,true,result);
        } else {
           sendResponse(res,STATUS_CODES.OK,MESSAGES.PAYMENT_VERIFICATION_FAILED,true,result);
        }

    }
}
