import { ISubscriptionPlan } from '../../../../models/subscriptionPlan';

export interface IStudentSubscriptionService {
  getAllForStudent(): Promise<ISubscriptionPlan[]>
}
