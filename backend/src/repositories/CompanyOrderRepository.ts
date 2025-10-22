import { ICompanyOrderRepository } from '../core/interfaces/repositories/ICompanyOrderRepository';
import { ICompanyOrder, CompanyOrderModel } from '../models/CompanyOrder';
import { injectable } from 'inversify';
import { ICourse  } from '../models/Course';

@injectable()
export class CompanyOrderRepository implements ICompanyOrderRepository {
  async create(order: Partial<ICompanyOrder>): Promise<ICompanyOrder> {
    const newOrder = new CompanyOrderModel(order);
    return await newOrder.save();
  }

  async findByStripeSessionId(orderId: string): Promise<ICompanyOrder | null> {
    return await CompanyOrderModel.findOne({ stripeSessionId: orderId });
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
      .populate<{ courses: ICourse[] }>('courses')
      .exec();
  }


  async getOrdersById(companyId: string): Promise<(ICompanyOrder & { courses: ICourse[] })[]> {
    return CompanyOrderModel.find({
      companyId,
      status: 'paid',
    });
     
  }

   async getCompanyOrders(): Promise<ICompanyOrder[]> {
    return CompanyOrderModel.find()
      .populate('companyId', 'name email')
      .populate('courses', 'title')
      .sort({ createdAt: -1 });
  }

  

}
