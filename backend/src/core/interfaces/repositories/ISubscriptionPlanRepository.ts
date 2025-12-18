import { ISubscriptionPlan } from '../../../models/subscriptionPlan';
import { IStudentSubscription } from '../../../models/StudentSubscription';

export interface ISubscriptionPlanRepository {
  create(plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan>;
  findAll(skip: number, limit: number, search?: string): Promise<ISubscriptionPlan[]>;
  countAll(search?: string): Promise<number>;
  update(id: string, plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan | null>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<ISubscriptionPlan | null>;
  findAllForStudents(): Promise<ISubscriptionPlan[]>;
  findAllForCompany(): Promise<ISubscriptionPlan[]>;
  findAllPlans(): Promise<ISubscriptionPlan[]>;
  findPlanById(planId: string): Promise<ISubscriptionPlan | null>;
  saveStudentSubscription(
    studentId: string,
    planId: string,
    orderId: string,
    paymentId?: string
  ): Promise<IStudentSubscription>;
  updatePaymentStatus(
    studentId: string,
    orderId: string,
    status: 'pending' | 'active' | 'expired' | 'cancelled',
    paymentId?: string
  ): Promise<IStudentSubscription | null>;
  findActiveSubscription(studentId: string): Promise<any | null>;
  findActiveSubscriptions(studentId: string): Promise<IStudentSubscription[] | null>;
}
