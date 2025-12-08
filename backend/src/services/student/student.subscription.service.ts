import { inject, injectable } from 'inversify';
import { IStudentSubscriptionService } from '../../core/interfaces/services/student/IStudentSubscriptionService';
import { ISubscriptionPlanRepository } from '../../core/interfaces/repositories/ISubscriptionPlanRepository';
import { TYPES } from '../../core/di/types';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { RazorpayOrderResponse, RazorpayVerifyPayload } from '../../types/filter/fiterTypes';
import { ISubscriptionPlan } from '../../models/subscriptionPlan';
import { IStudentSubscription } from '../../models/StudentSubscription';

@injectable()
export class StudentSubscriptionService implements IStudentSubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionPlanRepository)
    private _planRepo: ISubscriptionPlanRepository
  ) { }

  async getAllForStudent(): Promise<ISubscriptionPlan[]> {
    return this._planRepo.findAllForStudents();
  }



  async createOrder(studentId: string, planId: string): Promise<RazorpayOrderResponse> {
    const plan = await this._planRepo.findPlanById(planId);
    if (!plan) throwError(MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND);


    if (plan.price <= 0) {

      throwError(MESSAGES.INVALID_DATA);
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!
    });

    const order = await razorpay.orders.create({
      amount: plan.price * 100,
      currency: 'INR',
      receipt: `order_${Date.now()}`
    });

    await this._planRepo.saveStudentSubscription(studentId, planId, order.id);
    return order;
  }

  async verifyPayment(studentId: string, payload: RazorpayVerifyPayload): Promise<void> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = hmac.digest('hex');

    if (digest !== razorpay_signature) {
      throwError(MESSAGES.PAYMENT_VERIFICATION_FAILED);
    }

    await this._planRepo.updatePaymentStatus(
      studentId,
      razorpay_order_id,
      'active',
      razorpay_payment_id
    );
  }

  async activateFreePlan(studentId: string, planId: string): Promise<void> {
    const plan = await this._planRepo.findPlanById(planId);
    if (!plan) throwError(MESSAGES.INVALID_DATA);
    if (typeof plan.price === 'number' && plan.price > 0) {
      throwError(MESSAGES.INVALID_DATA);
    }

    await this._planRepo.saveStudentSubscription(
      studentId,
      planId,
      `free_${Date.now()}`,
      'free'
    );
  }

  async getActiveSubscription(studentId: string): Promise<IStudentSubscription | null> {
    return this._planRepo.findActiveSubscription(studentId);
  }



  async hasFeature(studentId: string, featureName: string): Promise<boolean> {
    const subscription = await this._planRepo.findActiveSubscription(studentId);
    if (!subscription) return false;

    const plan = await this._planRepo.getById(subscription.planId);
    if (!plan) return false;

    return plan.features.some(feature => feature.name === featureName);
  }

}
