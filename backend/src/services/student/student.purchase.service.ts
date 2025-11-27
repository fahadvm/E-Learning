


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
import { Transaction } from '../../models/Transaction';
import { Messages } from 'openai/resources/chat/completions';
import { ITransactionRepository } from '../../core/interfaces/repositories/ITransactionRepository';
import { IWalletRepository } from '../../core/interfaces/repositories/IwalletRepository';

@injectable()
export class StudentPurchaseService implements IStudentPurchaseService {
  private _razorpay: Razorpay;

  constructor(
    @inject(TYPES.OrderRepository) private readonly _orderRepo: IOrderRepository,
    @inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository,
    @inject(TYPES.CartRepository) private readonly _cartRepo: ICartRepository,
    @inject(TYPES.StudentRepository) private readonly _studentRepo: IStudentRepository,
    @inject(TYPES.SubscriptionPlanRepository) private readonly _subscriptionRepo: ISubscriptionPlanRepository,
    @inject(TYPES.TransactionRepository) private readonly _transactionRepo: ITransactionRepository,
    @inject(TYPES.WalletRepository) private readonly _walletRepo: IWalletRepository,
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
    logger.debug(`amount is  ${amount}`);

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

  async verifyPayment(
    details: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
    studentId: string
  ): Promise<{ success: boolean }> {
    logger.debug(
      details.razorpay_order_id,
      details.razorpay_payment_id,
      details.razorpay_signature
    );

    const body = `${details.razorpay_order_id}|${details.razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === details.razorpay_signature;

    await this._orderRepo.updateStatus(
      details.razorpay_order_id,
      isValid ? "paid" : "failed"
    );

    if (!isValid) {
      await this._cartRepo.clearCart(studentId);
      return { success: false };
    }

    // ---------------- STEP 1: Fetch order ----------------
    const order = await this._orderRepo.findByRazorpayOrderId(
      details.razorpay_order_id
    );

    // CORRECTED: check order existence and id properly
    if (!order || !order._id) throwError(MESSAGES.ORDER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const studentObjId = new mongoose.Types.ObjectId(studentId);

    // ---------------- STEP 2: Calculate platform fee + teacher share ----------------
    const commissionRate = typeof order.commissionRate === "number" ? order.commissionRate : 0.20;
    const platformFee = Math.round(order.amount * commissionRate);
    const teacherShare = order.amount - platformFee;

    // Save platformFee + share into the order (cast id to ObjectId for update)
    await this._orderRepo.update(order._id as mongoose.Types.ObjectId, {
      platformFee,
      teacherShare,
    });

    // ---------------- STEP 3: Create COURSE_PURCHASE transaction ----------------
    await this._transactionRepo.create({
      userId: studentObjId,
      type: "COURSE_PURCHASE",
      txnNature: "CREDIT",

      amount: order.amount,
      grossAmount: order.amount,
      teacherShare: teacherShare,
      platformFee: platformFee,

      paymentMethod: "RAZORPAY",
      paymentStatus: "SUCCESS",

      notes: `Purchase for courses: ${order.courses.join(",")}`,
    });

    // ---------------- STEP 4: Loop each course -> TEACHER_EARNING + wallet credit ----------------
    // Normalize course ids and handle typing (order.courses may be ObjectId[] or string[])
    for (const rawCourseId of order.courses) {
      // Normalize courseId to a string (safe) and an ObjectId for DB usage
      const courseIdStr = (rawCourseId as any)?.toString();
      console.log("courseIdStr", courseIdStr)
      if (!courseIdStr) continue;

      const course = (await this._courseRepo.findById(courseIdStr)) as ICourse | null;
      if (!course) continue;
      console.log("course", course)

      // teacherId may be ObjectId or a populated document; normalize to string/ObjectId
      const rawTeacherId = (course as any).teacherId._id;
      if (!rawTeacherId) continue;

      // teacherIdNormalized will be a string id we can pass to mongoose when needed
      const teacherIdStr = rawTeacherId.toString();
      if (!teacherIdStr) continue;

      // course price: prefer course.price, otherwise split equally
      const coursePrice = typeof (course as any).price === "number"
        ? (course as any).price
        : Math.round(order.amount / order.courses.length);

      const teacherCut = Math.round(coursePrice * (1 - commissionRate));
      const platformCut = coursePrice - teacherCut;
      console.log("final check here", teacherIdStr, courseIdStr)


      // Create TEACHER_EARNING transaction
      const earningTx = await this._transactionRepo.create({
        teacherId: new mongoose.Types.ObjectId(teacherIdStr),
        courseId: new mongoose.Types.ObjectId(courseIdStr),
        type: "TEACHER_EARNING",
        txnNature: "CREDIT",

        amount: teacherCut,
        grossAmount: coursePrice,
        teacherShare: teacherCut,
        platformFee: platformCut,

        paymentMethod: "WALLET",
        paymentStatus: "SUCCESS",

        notes: `Earning for course ${courseIdStr}`,
      });

      // Credit teacher wallet (atomic upsert)
      await this._walletRepo.creditTeacherWallet({
        teacherId: new mongoose.Types.ObjectId(teacherIdStr),
        amount: teacherCut,
        transactionId: earningTx._id,
      });
      await this._courseRepo.incrementStudentCount(courseIdStr);

    }

    await this._cartRepo.clearCart(studentId);
    return { success: true };
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

  async getOrderDetails(studentId: string, orderId: string): Promise<IOrder> {
    console.log("checking for details ids are", studentId, orderId)
    const order = await this._orderRepo.getOrderDetailsByrazorpayOrderId(studentId, orderId);

    if (!order) throwError(MESSAGES.ORDER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return order;
  }
}
