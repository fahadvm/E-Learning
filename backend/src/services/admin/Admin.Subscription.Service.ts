// src/services/admin/SubscriptionPlanService.ts
import { inject, injectable } from 'inversify';
import { IAdminSubscriptionPlanService } from '../../core/interfaces/services/admin/IAdminSubscriptionPlanService';
import { ISubscriptionPlanRepository } from '../../core/interfaces/repositories/ISubscriptionPlanRepository';
import { TYPES } from '../../core/di/types';
import { ISubscriptionPlan } from '../../models/subscriptionPlan';
import { MESSAGES } from '../../utils/ResponseMessages';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { IAdminSubscriptionPlanDTO, adminSubscriptionPlanDto, PaginatedSubscriptionPlanDTO } from '../../core/dtos/admin/Admin.subscriptionPlan.Dto';
@injectable()
export class AdminSubscriptionPlanService implements IAdminSubscriptionPlanService {
  constructor(
    @inject(TYPES.SubscriptionPlanRepository)
    private _planRepo: ISubscriptionPlanRepository
  ) { }

  async createPlan(data: Partial<ISubscriptionPlan>): Promise<IAdminSubscriptionPlanDTO> {
    const plan = await this._planRepo.create(data);
    return adminSubscriptionPlanDto(plan);
  }

  async getAllPlans(
    page?: number,
    limit?: number,
    search?: string
  ): Promise<PaginatedSubscriptionPlanDTO> {
    page = page || 1;
    limit = limit || 10;

    if (page < 1 || limit < 1) {
      throwError(MESSAGES.PAGE_OUT_OF_RANGE, STATUS_CODES.BAD_REQUEST);
    }

    const skip = (page - 1) * limit;
    const plans = await this._planRepo.findAll(skip, limit, search);
    const total = await this._planRepo.countAll(search);
    const totalPages = Math.ceil(total / limit);

    return {
      plans: plans.map(adminSubscriptionPlanDto),
      total,
      totalPages
    };
  }

  async getPlanById(id: string): Promise<IAdminSubscriptionPlanDTO> {
    const plan = await this._planRepo.getById(id);
    if (!plan) throwError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminSubscriptionPlanDto(plan);
  }

  async updatePlan(id: string, data: Partial<ISubscriptionPlan>): Promise<IAdminSubscriptionPlanDTO> {
    const updated = await this._planRepo.update(id, data);
    if (!updated) throwError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminSubscriptionPlanDto(updated);
  }

  async deletePlan(id: string): Promise<void> {
  const plan = await this._planRepo.getById(id);
  if (!plan) throwError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  await this._planRepo.delete(id);
}

  async getAllForStudent(): Promise<IAdminSubscriptionPlanDTO[]> {
    const plans = await this._planRepo.findAllForStudents();
    return plans.map(adminSubscriptionPlanDto);
  }

  async getAllForCompany(): Promise<IAdminSubscriptionPlanDTO[]> {
    const plans = await this._planRepo.findAllForCompany();
    return plans.map(adminSubscriptionPlanDto);
  }
}