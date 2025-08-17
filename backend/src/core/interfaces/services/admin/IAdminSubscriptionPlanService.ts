import { ISubscriptionPlan } from '../../../../models/subscriptionPlan';

export interface IAdminSubscriptionPlanService {
  create(plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan>
  getAll(): Promise<ISubscriptionPlan[]>
  update(id: string, plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan | null>
  delete(id: string): Promise<void>
  getById(id: string): Promise<ISubscriptionPlan | null>;
  getAllForStudent(): Promise<ISubscriptionPlan[]>
  getAllForCompany(): Promise<ISubscriptionPlan[]>


}
