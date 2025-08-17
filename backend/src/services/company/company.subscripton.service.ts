import { inject, injectable } from 'inversify';
import { ICompanySubscriptionService } from '../../core/interfaces/services/company/ICompanySubscriptionService';
import { ISubscriptionPlanRepository } from '../../core/interfaces/repositories/ISubscriptionPlanRepository';
import { ISubscriptionPlan } from '../../models/subscriptionPlan';
import { TYPES } from '../../core/di/types';

@injectable()
export class CompanySubscriptionService implements ICompanySubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionPlanRepository)
    private readonly _planRepository: ISubscriptionPlanRepository
  ) {}

  async getAllForCompany(): Promise<ISubscriptionPlan[]> {
    return this._planRepository.findAllForCompany();
  }
}
