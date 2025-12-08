import { ICompanyOrderRepository } from '../core/interfaces/repositories/ICompanyOrderRepository';
import { ICompanyOrder, CompanyOrderModel } from '../models/CompanyOrder';
import { injectable } from 'inversify';
import { ICourse, Course } from '../models/Course';
import { CourseResource } from '../models/CourseResource';

@injectable()
export class CompanyOrderRepository implements ICompanyOrderRepository {
  async create(order: Partial<ICompanyOrder>): Promise<ICompanyOrder> {
    const newOrder = new CompanyOrderModel(order);
    return await newOrder.save();
  }

  async findByStripeSessionId(orderId: string): Promise<ICompanyOrder | null> {
    return await CompanyOrderModel.findOne({ stripeSessionId: orderId })
      .populate("purchasedCourses.courseId", "title price");
  }

  async updateStatus(orderId: string, status: string): Promise<ICompanyOrder | null> {
    return await CompanyOrderModel.findOneAndUpdate(
      { stripeSessionId: orderId },
      { status },
      { new: true }
    );
  }

  async getOrdersByCompanyId(companyId: string): Promise<(ICompanyOrder & { courses: ICourse[] })[]> {
    return CompanyOrderModel.find({
      companyId,
      status: 'paid',
    })
      .populate<{ purchasedCourses: { courseId: ICourse }[] }>('purchasedCourses.courseId')
      .exec() as any;
  }

  async getOrdersById(companyId: string): Promise<ICompanyOrder[]> {
    return CompanyOrderModel.find({
      companyId,
      status: 'paid',
    })
      .populate('purchasedCourses.courseId');
  }

  async getCompanyOrders(): Promise<ICompanyOrder[]> {
    return CompanyOrderModel.find()
      .populate('companyId', 'name email')
      .populate('purchasedCourses.courseId', 'title')
      .sort({ createdAt: -1 });
  }

  async getPurchasedCourseIds(companyId: string): Promise<string[]> {
    const orders = await CompanyOrderModel.find({
      companyId,
      status: "paid"
    }).select("purchasedCourses");

    const purchasedCourseIds = orders.flatMap(order =>
      order.purchasedCourses.map(pc => pc.courseId.toString())
    );

    return purchasedCourseIds;
  }
}
