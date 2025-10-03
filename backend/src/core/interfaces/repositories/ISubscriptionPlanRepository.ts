// src/core/interfaces/repositories/admin/ISubscriptionPlanRepository.ts
import { ISubscriptionPlan } from '../../../models/subscriptionPlan';

export interface ISubscriptionPlanRepository {
  create(plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan>
  findAll(skip: number, limit: number, search?: string):Promise<ISubscriptionPlan[]>
  countAll(search?: string): Promise<number>;
  update(id: string, plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan | null>
  delete(id: string): Promise<void>
  getById(id: string): Promise<ISubscriptionPlan | null>;
  findAllForStudents(): Promise<ISubscriptionPlan[]>
  findAllForCompany(): Promise<ISubscriptionPlan[]>
  findAllPlans(): Promise<any[]>;
  findPlanById(planId: string): Promise<any | null>;
  saveStudentSubscription(studentId: string, planId: string, orderId: string, paymentId?: string): Promise<any>;
  updatePaymentStatus(orderId: string, status: string, paymentId?: string): Promise<any>;
  findActiveSubscription(studentId: string): Promise<any | null>;

}

 


