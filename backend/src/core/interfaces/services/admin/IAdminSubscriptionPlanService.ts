import { IAdminSubscriptionPlanDTO, PaginatedSubscriptionPlanDTO } from '../../../dtos/admin/Admin.subscriptionPlan.Dto';
import { ISubscriptionPlan } from '../../../../models/subscriptionPlan';

export interface IAdminSubscriptionPlanService {
  createPlan(data: Partial<ISubscriptionPlan>): Promise<IAdminSubscriptionPlanDTO>;
  getAllPlans(page?: number, limit?: number, search?: string): Promise<PaginatedSubscriptionPlanDTO>;
  getPlanById(id: string): Promise<IAdminSubscriptionPlanDTO>;
  updatePlan(id: string, data: Partial<ISubscriptionPlan>): Promise<IAdminSubscriptionPlanDTO>;
  deletePlan(id: string): Promise<void>;

}
