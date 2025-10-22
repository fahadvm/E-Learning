import { IStudentSubscription } from '../../../../models/StudentSubscription';
import { ISubscriptionPlan } from '../../../../models/subscriptionPlan';
import { RazorpayOrderResponse, RazorpayVerifyPayload } from '../../../../types/filter/fiterTypes';

export interface IStudentSubscriptionService {
  getAllForStudent(): Promise<ISubscriptionPlan[]>;
  createOrder(studentId: string, planId: string): Promise<RazorpayOrderResponse>;
  verifyPayment(studentId: string, payload: RazorpayVerifyPayload): Promise<void>;
  activateFreePlan(studentId: string, planId: string): Promise<void>;
  getActiveSubscription(studentId: string): Promise<IStudentSubscription | null>;
}
