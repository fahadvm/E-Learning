import { ISubscriptionPlan } from '../../../../models/subscriptionPlan';

export interface ICompanySubscriptionService {
  getAllForCompany(): Promise<ISubscriptionPlan[]>;
}
