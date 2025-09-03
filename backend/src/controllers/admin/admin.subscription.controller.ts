import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAdminSubscriptionPlanService } from '../../core/interfaces/services/admin/IAdminSubscriptionPlanService';
import { TYPES } from '../../core/di/types';
import { sendResponse } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class AdminSubscriptionPlanController {
  constructor(
    @inject(TYPES.AdminSubscriptionPlanService)
    private readonly _planService: IAdminSubscriptionPlanService
  ) {}

  async createPlan(req: Request, res: Response): Promise<void> {
    const plan = await this._planService.createPlan(req.body);
    sendResponse(res, STATUS_CODES.CREATED, MESSAGES.SUBSCRIPTION_PLAN_CREATED, true, plan);
  }

  async getAllPlans(req: Request, res: Response): Promise<void> {
    console.log('adding new plans in backend ');
    const plans = await this._planService.getAllPlans();
    sendResponse(res, STATUS_CODES.OK, MESSAGES.SUBSCRIPTION_PLANS_FETCHED, true, plans);
  }

  async getPlanById(req: Request, res: Response): Promise<void> {
    const plan = await this._planService.getPlanById(req.params.planId);
    if (!plan) {
      return sendResponse(res, STATUS_CODES.NOT_FOUND, MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND, false, null);
    }
    sendResponse(res, STATUS_CODES.OK, MESSAGES.SUBSCRIPTION_PLAN_FETCHED, true, plan);
  }

  async updatePlan(req: Request, res: Response): Promise<void> {
    const updated = await this._planService.updatePlan(req.params.planId, req.body);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.SUBSCRIPTION_PLAN_UPDATED, true, updated);
  }

  async deletePlan(req: Request, res: Response): Promise<void> {
    await this._planService.deletePlan(req.params.planId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.SUBSCRIPTION_PLAN_DELETED, true, null);
  }
}
