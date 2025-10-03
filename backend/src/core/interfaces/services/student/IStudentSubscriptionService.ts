import { ISubscriptionPlan } from '../../../../models/subscriptionPlan';

export interface IStudentSubscriptionService {
  getAllForStudent(): Promise<ISubscriptionPlan[]>
  getAllPlans(): Promise<ISubscriptionPlan[]>
  createOrder(studentId: string, planId: string): Promise<any>;
  verifyPayment(studentId: string, payload: any): Promise<any>;
  activateFreePlan(studentId: string, planId: string): Promise<any>;
  getActiveSubscription(studentId: string): Promise<any | null>;

}
