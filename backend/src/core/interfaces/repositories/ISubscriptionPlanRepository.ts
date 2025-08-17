// src/core/interfaces/repositories/admin/ISubscriptionPlanRepository.ts
import { ISubscriptionPlan } from '../../../models/subscriptionPlan';

export interface ISubscriptionPlanRepository {
  create(plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan>
  findAll(): Promise<ISubscriptionPlan[]>
  update(id: string, plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan | null>
  delete(id: string): Promise<void>
  getById(id: string): Promise<ISubscriptionPlan | null>;
  findAllForStudents(): Promise<ISubscriptionPlan[]>
  findAllForCompany(): Promise<ISubscriptionPlan[]>
 

}
