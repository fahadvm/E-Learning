// src/repositories/admin/SubscriptionPlanRepository.ts
import { injectable } from 'inversify';
import { FilterQuery } from 'mongoose';

import { ISubscriptionPlanRepository } from '../core/interfaces/repositories/ISubscriptionPlanRepository';
import { ISubscriptionPlan, SubscriptionPlan } from '../models/subscriptionPlan';
import { IStudentSubscription, StudentSubscription } from '../models/StudentSubscription';


@injectable()
export class SubscriptionPlanRepository implements ISubscriptionPlanRepository {
  async create(plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan> {
    return await SubscriptionPlan.create(plan);
  }

  async findAll(skip: number, limit: number, search?: string): Promise<ISubscriptionPlan[]> {
    const filter: FilterQuery<ISubscriptionPlan> = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    return await SubscriptionPlan.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async countAll(search?: string): Promise<number> {
    const filter: FilterQuery<ISubscriptionPlan> = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    return SubscriptionPlan.countDocuments(filter).exec();
  }

  async getById(id: string): Promise<ISubscriptionPlan | null> {
    return await SubscriptionPlan.findById(id);
  }

  async update(id: string, plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan | null> {
    return await SubscriptionPlan.findByIdAndUpdate(id, plan, { new: true });
  }

  async delete(id: string): Promise<void> {
    await SubscriptionPlan.findByIdAndDelete(id);
  }

  async findAllForStudents(): Promise<ISubscriptionPlan[]> {
    return await SubscriptionPlan.find({ planFor: 'student' });
  }

  async findAllForCompany(): Promise<ISubscriptionPlan[]> {
    return await SubscriptionPlan.find({ planFor: 'company' });
  }

  async findAllPlans(): Promise<ISubscriptionPlan[]> {
    return await SubscriptionPlan.find({ isActive: true });
  }

  async findPlanById(planId: string): Promise<ISubscriptionPlan | null> {
    return await SubscriptionPlan.findById(planId);
  }

  async saveStudentSubscription(
    studentId: string,
    planId: string,
    orderId: string,
    paymentId?: string
  ): Promise<IStudentSubscription> {
    return await StudentSubscription.create({
      studentId,
      planId,
      orderId,
      paymentId,
      status: 'pending',
    });
  }

  async updatePaymentStatus(
    orderId: string,
    status: 'pending' | 'active' | 'expired' | 'cancelled',
    paymentId?: string
  ): Promise<IStudentSubscription | null> {
    return await StudentSubscription.findOneAndUpdate(
      { orderId },
      { status, paymentId },
      { new: true }
    );
  }

  async findActiveSubscription(studentId: string): Promise<IStudentSubscription | null> {
    return await StudentSubscription.findOne({ studentId, status: 'active' });
  }
}