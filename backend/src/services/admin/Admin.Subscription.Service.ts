// src/services/admin/SubscriptionPlanService.ts
import { inject, injectable } from 'inversify';
import { IAdminSubscriptionPlanService } from '../../core/interfaces/services/admin/IAdminSubscriptionPlanService';
import { ISubscriptionPlanRepository } from '../../core/interfaces/repositories/ISubscriptionPlanRepository';
import { TYPES } from '../../core/di/types';
import { ISubscriptionPlan } from '../../models/subscriptionPlan';

@injectable()
export class AdminSubscriptionPlanService implements IAdminSubscriptionPlanService {
  constructor(
    @inject(TYPES.AdminSubscriptionPlanService)
    private _planRepo: ISubscriptionPlanRepository
  ) {}

  create(plan: Partial<ISubscriptionPlan>) {
    return this._planRepo.create(plan);
  }

  getAll() {
    return this._planRepo.findAll();
  }

  update(id: string, plan: Partial<ISubscriptionPlan>) {
    return this._planRepo.update(id, plan);
  }

    async getById(id: string): Promise<ISubscriptionPlan | null> {
    return this._planRepo.getById(id);
  }

  delete(id: string) {
    return this._planRepo.delete(id);
  }

  
   getAllForStudent() {
    return this._planRepo.findAllForStudents();
  }

    getAllForCompany() {
    return this._planRepo.findAllForCompany();
  }
}
