import { IOrderRepository } from '../core/interfaces/repositories/IOrderRepository';
import { IOrder, OrderModel } from '../models/Order';
import { injectable } from 'inversify';
import { ICourse  } from '../models/Course';

@injectable()
export class OrderRepository implements IOrderRepository {
  async create(order: Partial<IOrder>): Promise<IOrder> {
    const newOrder = new OrderModel(order);
    return await newOrder.save();
  }

  async findByRazorpayOrderId(orderId: string): Promise<IOrder | null> {
    return await OrderModel.findOne({ razorpayOrderId: orderId });
  }

  async updateStatus(orderId: string, status: string): Promise<IOrder | null> {
    return await OrderModel.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { status },
      { new: true }
    );
  }

  async getOrdersByStudentId(studentId: string): Promise<(IOrder & { courses: ICourse[] })[]> {
    return OrderModel.find({
      studentId,
      status: 'paid',
    })
      .populate<{ courses: ICourse[] }>('courses')
      .exec();
  }

    async getStudentOrders(): Promise<IOrder[]> {
    return OrderModel.find()
      .populate('studentId', 'name email')
      .populate('courses', 'title')
      .sort({ createdAt: -1 });
  }

  

}
