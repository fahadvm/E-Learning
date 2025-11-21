
import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { IOrderRepository } from '../../core/interfaces/repositories/IOrderRepository';
import { IOrder } from '../../models/Order';
import { TYPES } from '../../core/di/types';
import { IStudentPurchaseService } from '../../core/interfaces/services/student/IStudentPurchaseService';
import { ICourse } from '../../models/Course';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import { ICartRepository } from '../../core/interfaces/repositories/ICartRepository';
import { ISubscriptionPlanRepository } from '../../core/interfaces/repositories/ISubscriptionPlanRepository';
import { ICourseProgress } from '../../models/Student';
import { IStudentRepository } from '../../core/interfaces/repositories/IStudentRepository';
import logger from '../../utils/logger';

@injectable()
export class StudentPurchaseService implements IStudentPurchaseService {
  private _razorpay: Razorpay;

  constructor(
    @inject(TYPES.OrderRepository) private readonly _orderRepo: IOrderRepository,
    @inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository,
    @inject(TYPES.CartRepository) private readonly _cartRepo: ICartRepository,
    @inject(TYPES.StudentRepository) private readonly _studentRepo: IStudentRepository,
    @inject(TYPES.SubscriptionPlanRepository) private readonly _subscriptionRepo: ISubscriptionPlanRepository
  ) {
    this._razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(
    studentId: string,
    courses: string[],
    amount: number,
    currency = 'INR'
  ): Promise<Partial<IOrder>> {
    logger.debug('amount is ', amount);
    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: { studentId, courses: JSON.stringify(courses) },
    };

    const razorpayOrder = await this._razorpay.orders.create(options);

    const studentObjId = new mongoose.Types.ObjectId(studentId);
    const courseObjIds = courses.map(id => new mongoose.Types.ObjectId(id));

    const newOrder: IOrder = await this._orderRepo.create({
      studentId: studentObjId,
      courses: courseObjIds,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: razorpayOrder.currency,
      status: 'created',
    });

    return {
      _id: newOrder._id,
      razorpayOrderId: newOrder.razorpayOrderId,
      amount: newOrder.amount,
      currency: newOrder.currency,
      status: newOrder.status,
      studentId: newOrder.studentId,
      courses: newOrder.courses,
    };
  }

  async verifyPayment(details: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }, studentId: string): Promise<{ success: boolean }> {
    logger.debug(
      details.razorpay_order_id,
      details.razorpay_payment_id,
      details.razorpay_signature);
    const body = `${details.razorpay_order_id}|${details.razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === details.razorpay_signature;
    await this._orderRepo.updateStatus(
      details.razorpay_order_id,
      isValid ? 'paid' : 'failed'
    );
    await this._cartRepo.clearCart(studentId);

    return { success: isValid };
  }

  async getPurchasedCourses(studentId: string): Promise<IOrder[] | ICourse[]> {
    const ispremium = await this._subscriptionRepo.findActiveSubscription(studentId);
    if (ispremium) {
      // const courses = await this._courseRepo.getPremiumCourses();  
      // return courses
    }
    const orders = await this._orderRepo.getOrdersByStudentId(studentId);
    return orders;
  }
  async getPurchasedCourseIds(studentId: string): Promise<string[]> {
    const courseIds = await this._orderRepo.getOrderedCourseIds(studentId);
    return courseIds;
  }

  async getPurchasedCourseDetails(courseId: string, studentId: string): Promise<{ course: ICourse; progress: ICourseProgress }> {
    if (!courseId || !studentId) throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);
    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    const student = await this._studentRepo.findById(studentId);
    if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    const progress = await this._studentRepo.getOrCreateCourseProgress(studentId, courseId);
    return { course, progress };
  }

  async getOrderDetails(studentId: string, orderId: string):Promise<IOrder> {
    console.log("checking for details ids are", studentId ,  orderId)
    const order = await this._orderRepo.getOrderDetailsByrazorpayOrderId(studentId, orderId);

    if (!order) throwError(MESSAGES.ORDER_NOT_FOUND,STATUS_CODES.NOT_FOUND);
    return order;
  }
}
