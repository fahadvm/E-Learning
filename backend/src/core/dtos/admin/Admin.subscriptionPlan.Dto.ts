import { ISubscriptionPlan } from '../../../models/subscriptionPlan';

export interface IAdminSubscriptionPlanDTO {
  _id: string;
  name: string;
  price: number | 'Free' | 'Custom';
  planFor: 'company' | 'student';
  description: string;
  features: string[];
  popular: boolean;

}

export interface PaginatedSubscriptionPlanDTO {
  plans: IAdminSubscriptionPlanDTO[];
  total: number;
  totalPages: number;
}

export const adminSubscriptionPlanDto = (plan: ISubscriptionPlan): IAdminSubscriptionPlanDTO => ({
  _id: plan._id.toString(),
  name: plan.name,
  price: plan.price,
  planFor: plan.planFor,
  description: plan.description,
  features: plan.features,
  popular: plan.popular || false,

});
