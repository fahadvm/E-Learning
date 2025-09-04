import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ICompanySubscriptionService } from '../../core/interfaces/services/company/ICompanySubscriptionService';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse } from '../../utils/ResANDError';
import { TYPES } from '../../core/di/types';
import { MESSAGES } from '../../utils/ResponseMessages';
import { ICompanySubscriptionController } from '../../core/interfaces/controllers/company/ICompanySubscriptionController';

@injectable()
export class CompanySubscriptionController implements ICompanySubscriptionController {
  constructor(
    @inject(TYPES.CompanySubscriptionService)private readonly _planService: ICompanySubscriptionService) {}

  async getAllCompanyPlans(req: Request, res: Response): Promise<void> {
    const plans = await this._planService.getAllForCompany();
    sendResponse(res, STATUS_CODES.OK, MESSAGES.SUBSCRIPTION_PLANS_FETCHED, true, plans);
  }
}
