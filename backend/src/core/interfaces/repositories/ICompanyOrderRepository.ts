// src/core/interfaces/repositories/IOrderRepository.ts
import { ICompanyOrder } from '../../../models/CompanyOrder';
import { ICourse } from '../../../models/Course';

export interface ICompanyOrderRepository {
  create(order: Partial<ICompanyOrder>): Promise<ICompanyOrder>;
  findByStripeSessionId(orderId: string): Promise<ICompanyOrder | null>;
  updateStatus(orderId: string, status: string): Promise<ICompanyOrder | null>;
  getOrdersByCompanyId(companyId: string): Promise<(ICompanyOrder & { courses: ICourse[] })[]>;
  getOrdersById(companyId: string): Promise<(ICompanyOrder & { courses: ICourse[] })[]>
  getCompanyOrders(): Promise<ICompanyOrder[]>;
  getPurchasedCourseIds(companyId: string): Promise<string[]>

}
