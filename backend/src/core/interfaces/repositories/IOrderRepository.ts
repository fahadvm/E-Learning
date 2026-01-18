// src/core/interfaces/repositories/IOrderRepository.ts
import { IOrder } from '../../../models/Order';
import { ICourse } from '../../../models/Course';
import { Types } from 'mongoose';

export interface IOrderRepository {
  create(order: Partial<IOrder>): Promise<IOrder>;
  findByRazorpayOrderId(orderId: string): Promise<IOrder | null>;
  update(id: Types.ObjectId | string, update: Partial<IOrder>): Promise<IOrder | null>;
  updateStatus(orderId: string, status: string): Promise<IOrder | null>;
  getOrdersByStudentId(studentId: string): Promise<(IOrder & { courses: ICourse[] })[]>;
  getStudentOrders(): Promise<IOrder[]>;
  getOrderedCourseIds(studentId: string): Promise<string[]>
  getOrderDetailsByrazorpayOrderId(studentId: string, orderId: string): Promise<IOrder | null>
  findOrdersByStudent(
    studentId: string,
    page: number,
    limit: number
  ): Promise<{ orders: IOrder[]; total: number }>;
  getEnrolmentAnalytics(courseId: string): Promise<{ month: string, count: number }[]>;
}
