// src/services/admin/SubscriptionPlanService.ts
import { inject, injectable } from 'inversify';
import { IStudentSubscriptionService } from '../../core/interfaces/services/student/IStudentSubscriptionService';
import { ISubscriptionPlanRepository } from '../../core/interfaces/repositories/ISubscriptionPlanRepository';
import { TYPES } from '../../core/di/types';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class StudentSubscriptionService implements IStudentSubscriptionService {
    constructor(
        @inject(TYPES.SubscriptionPlanRepository)
        private _planRepo: ISubscriptionPlanRepository
    ) {}

    getAllForStudent() {
        return this._planRepo.findAllForStudents();
    }
    getAllPlans() {
        return this._planRepo.findAllForStudents();
    }
    async createOrder(studentId: string, planId: string) {
    const plan = await this._planRepo.findPlanById(planId);
    if (!plan) throwError(MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND);

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

  async verifyPayment(studentId: string, payload: any) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = payload;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    if (hmac.digest('hex') !== razorpay_signature) throwError(MESSAGES.PAYMENT_VERIFICATION_FAILED)

    return this._planRepo.updatePaymentStatus(razorpay_order_id, 'active', razorpay_payment_id);
  }

  async activateFreePlan(studentId: string, planId: string) {
    const plan = await this._planRepo.findPlanById(planId);
    if (!plan || plan.price > 0) throwError(MESSAGES.INVALID_DATA)

    return this._planRepo.saveStudentSubscription(studentId, planId, `free_${Date.now()}`, 'free');
  }

  async getActiveSubscription(studentId: string) {
    return this._planRepo.findActiveSubscription(studentId);
  }

}