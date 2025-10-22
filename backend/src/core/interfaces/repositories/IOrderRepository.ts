// src/core/interfaces/repositories/IOrderRepository.ts
import { IOrder } from '../../../models/Order';
import { ICourse } from '../../../models/Course';

export interface IOrderRepository {
  create(order: Partial<IOrder>): Promise<IOrder>;
  findByRazorpayOrderId(orderId: string): Promise<IOrder | null>;
  updateStatus(orderId: string, status: string): Promise<IOrder | null>;
  getOrdersByStudentId(studentId: string): Promise<(IOrder & { courses: ICourse[] })[]>;
    getStudentOrders(): Promise<IOrder[]>;

}
