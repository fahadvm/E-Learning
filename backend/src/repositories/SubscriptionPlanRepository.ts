// src/repositories/admin/SubscriptionPlanRepository.ts
import { injectable } from 'inversify';
import { FilterQuery } from 'mongoose';

import { ISubscriptionPlanRepository } from '../core/interfaces/repositories/ISubscriptionPlanRepository';
import { ISubscriptionPlan, SubscriptionPlan } from '../models/subscriptionPlan';
import { StudentSubscription } from '../models/StudentSubscription';

@injectable()
export class SubscriptionPlanRepository implements ISubscriptionPlanRepository {
  async create(plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan> {
    return await SubscriptionPlan.create(plan);
  }
  async findAllPlans() { return SubscriptionPlan.find({ isActive: true }); }

  async findAll(): Promise<ISubscriptionPlan[]> {
    return await SubscriptionPlan.find();
  }

  async countAll(search?: string): Promise<number> {
    const filter: FilterQuery<ISubscriptionPlan> = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    return SubscriptionPlan.countDocuments(filter).exec();
  }




  async getById(id: string): Promise<ISubscriptionPlan | null> {
    console.log('trying to get in repository ',id);

    return await SubscriptionPlan.findById(id);
  }

  async update(id: string, plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan | null> {
    return await SubscriptionPlan.findByIdAndUpdate(id, plan, { new: true });
  }

  async delete(id: string): Promise<void> {
    await SubscriptionPlan.findByIdAndDelete(id);
  }


  async findAllForStudents(): Promise<ISubscriptionPlan[]> {
    return await SubscriptionPlan.find({ planFor: 'Student' });
  }
  async findAllForCompany(): Promise<ISubscriptionPlan[]> {
    return await SubscriptionPlan.find({ planFor: 'Company' });
  }
  
  async findPlanById(planId: string) { return SubscriptionPlan.findById(planId); }

  async saveStudentSubscription(studentId: string, planId: string, orderId: string, paymentId?: string) {
    return StudentSubscription.create({ studentId, planId, orderId, paymentId, status: 'pending' });
  }

  async updatePaymentStatus(orderId: string, status: string, paymentId?: string) {
    return StudentSubscription.findOneAndUpdate({ orderId }, { status, paymentId }, { new: true });
  }

  async findActiveSubscription(studentId: string) {
    return StudentSubscription.findOne({ studentId, status: 'active' });
  }



}
