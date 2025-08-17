// src/repositories/admin/SubscriptionPlanRepository.ts
import { injectable } from 'inversify';
import { ISubscriptionPlanRepository } from '../core/interfaces/repositories/ISubscriptionPlanRepository';
import { ISubscriptionPlan, SubscriptionPlan } from '../models/subscriptionPlan';

@injectable()
export class SubscriptionPlanRepository implements ISubscriptionPlanRepository {
  async create(plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan> {
    return await SubscriptionPlan.create(plan);
  }

  async findAll(): Promise<ISubscriptionPlan[]> {
    return await SubscriptionPlan.find();
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
    return await SubscriptionPlan.find({planFor: 'Student'});
  }
  async findAllForCompany(): Promise<ISubscriptionPlan[]> {
    return await SubscriptionPlan.find({planFor: 'Company'});
  }

  
   
}
