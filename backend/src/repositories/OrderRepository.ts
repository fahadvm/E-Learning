import { IOrderRepository } from '../core/interfaces/repositories/IOrderRepository';
import { IOrder, OrderModel } from '../models/Order';
import { injectable } from 'inversify';
import mongoose, { Types } from 'mongoose';
import { ICourse } from '../models/Course';

@injectable()
export class OrderRepository implements IOrderRepository {
  async create(order: Partial<IOrder>): Promise<IOrder> {
    const newOrder = new OrderModel(order);
    return await newOrder.save();
  }

  async findByRazorpayOrderId(orderId: string): Promise<IOrder | null> {
    return await OrderModel.findOne({ razorpayOrderId: orderId });
  }

  async update(id: Types.ObjectId | string, update: Partial<IOrder>): Promise<IOrder | null> {
    return await OrderModel.findByIdAndUpdate(id, update, { new: true });
  }

  async updateStatus(orderId: string, status: string): Promise<IOrder | null> {
    return await OrderModel.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { status },
      { new: true }
    );
  }

  async getOrdersByStudentId(
    studentId: string
  ): Promise<(IOrder & { courses: ICourse[] })[]> {
    return OrderModel.find({
      studentId,
      status: 'paid',
    })
      .populate({
        path: 'courses',
        model: 'Course',
        populate: {
          path: 'teacherId',
          model: 'Teacher',
        },
      })
      .exec() as unknown as Promise<(IOrder & { courses: ICourse[] })[]>;
  }

  async getOrderedCourseIds(studentId: string): Promise<string[]> {
    const orders = await OrderModel.find({
      studentId,
      status: 'paid',
    })
      .select('courses')
      .exec();

    const courseIds = orders.flatMap((order) =>
      order.courses.map((c) => {
        if (c instanceof Types.ObjectId) return c.toString();
        if (typeof c === 'object' && '_id' in c) return (c as ICourse)._id?.toString() || '';
        return String(c);
      })
    );

    return courseIds;
  }


  async getStudentOrders(): Promise<IOrder[]> {
    return OrderModel.find()
      .populate('studentId', 'name email')
      .populate('courses', 'title')
      .sort({ createdAt: -1 });
  }




  async getOrderDetailsByrazorpayOrderId(studentId: string, orderId: string): Promise<IOrder | null> {
    const order = await OrderModel.findOne({ studentId, razorpayOrderId: orderId, status: 'paid' })
      .populate({
        path: 'studentId',
        select: 'name email',
      })
      .populate({
        path: 'courses',
        select: 'coverImage title totalDuration teacherId price',
        populate: {
          path: 'teacherId',
          select: 'name',
        },
      })
      .lean();
    return order as IOrder | null;
  }

  async findOrdersByStudent(
    studentId: string,
    page: number,
    limit: number
  ): Promise<{ orders: IOrder[]; total: number }> {
    const skip = (page - 1) * limit;

    // ensure valid ObjectId filter
    const filter: mongoose.FilterQuery<IOrder> = {};
    if (mongoose.Types.ObjectId.isValid(studentId)) {
      filter.studentId = new mongoose.Types.ObjectId(studentId);
    } else {
      // no orders if invalid id (caller should validate; defensive)
      return { orders: [], total: 0 };
    }

    const [total, orders] = await Promise.all([
      OrderModel.countDocuments(filter),
      OrderModel.find(filter)
        .populate('courses') // will populate course docs
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    return { orders: orders as IOrder[], total };
  }

  async getEnrolmentAnalytics(courseId: string): Promise<{ month: string, count: number }[]> {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await OrderModel.aggregate([
      {
        $match: {
          courses: { $in: [courseObjectId] },
          status: 'paid',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return result.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count
    }));
  }
}
