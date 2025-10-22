// src/core/interfaces/services/IAdminOrderService.ts
import { ICompanyOrder } from '../../../../models/CompanyOrder';
import { IOrder } from '../../../../models/Order';

export interface IAdminOrderService {
  getCompanyOrders(): Promise<ICompanyOrder[]>;
  getStudentOrders(): Promise<IOrder[]>;
}
