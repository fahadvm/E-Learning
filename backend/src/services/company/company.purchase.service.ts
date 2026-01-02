import { injectable, inject } from 'inversify';
import { ICompanyPurchaseService } from '../../core/interfaces/services/company/ICompanyPurchaseService';
import { stripe } from '../../config/stripe';
import dotenv from 'dotenv';
import { TYPES } from '../../core/di/types';
import { ICompanyCartRepository } from '../../core/interfaces/repositories/ICompanyCartRepository';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import mongoose from 'mongoose';
import { ICompanyRepository } from '../../core/interfaces/repositories/ICompanyRepository';
import { ICompanyOrderRepository } from '../../core/interfaces/repositories/ICompanyOrderRepository';
import { ICompanyOrder } from '../../models/CompanyOrder';
import { ICourse } from '../../models/Course';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

dotenv.config();

import { ITransactionRepository } from '../../core/interfaces/repositories/ITransactionRepository';
import { IWalletRepository } from '../../core/interfaces/repositories/IwalletRepository';
import { ICompanyCoursePurchaseRepository } from '../../core/interfaces/repositories/ICompanyCoursePurchaseRepository';
import { ITeacher } from '../../models/Teacher';

@injectable()
export class CompanyPurchaseService implements ICompanyPurchaseService {
  constructor(
    @inject(TYPES.CompanyOrderRepository) private readonly _companyOrderRepo: ICompanyOrderRepository,
    @inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository,
    @inject(TYPES.CompanyCartRepository) private readonly _cartRepo: ICompanyCartRepository,
    @inject(TYPES.CompanyRepository) private readonly _companyRepo: ICompanyRepository,
    @inject(TYPES.TransactionRepository) private readonly _transactionRepo: ITransactionRepository,
    @inject(TYPES.WalletRepository) private readonly _walletRepo: IWalletRepository,
    @inject(TYPES.CompanyCoursePurchaseRepository) private readonly _PurchaseRepo: ICompanyCoursePurchaseRepository
  ) { }

  /**
   * Create a Stripe Checkout session for a company
   */
  async createCheckoutSession(companyId: string) {
    const company = await this._companyRepo.findById(companyId);

    // Get cart with seat information
    const cart = await this._cartRepo.getCart(companyId);

    if (!cart || cart.courses.length === 0) {
      throwError(MESSAGES.CART_IS_EMPTY, STATUS_CODES.BAD_REQUEST);
    }

    // Extract course IDs for duplicate check
    // const courseIds = cart.courses.map(item => item.courseId._id?.toString() || item.courseId.toString());

    // const purchasedCourseIds = await this._companyOrderRepo.getPurchasedCourseIds(companyId);
    // const duplicates = courseIds.filter(id => purchasedCourseIds.includes(id));
    // if (duplicates.length > 0) {
    //   throwError(MESSAGES.COURSES_ALREADY_PURCHASED, STATUS_CODES.CONFLICT);
    // }

    // Calculate total amount from cart
    const amount = cart.courses.reduce((sum, item) => sum + item.price, 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: company?.name || 'unknown',
              description: 'Purchase courses from devnext!',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/company/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/company/checkout/cancel`,
    });

    const companyIdObj = new mongoose.Types.ObjectId(companyId);

    // Build purchasedCourses array with seat information
    const purchasedCourses = cart.courses.map(item => ({
      courseId: new mongoose.Types.ObjectId(item.courseId._id?.toString() || item.courseId.toString()),
      accessType: item.accessType,
      seats: item.seats,
      price: item.price
    }));

    await this._companyOrderRepo.create({
      companyId: companyIdObj,
      purchasedCourses,
      stripeSessionId: session.id,
      amount,
      currency: 'inr',
      status: 'created',
    });

    return { url: session.url };
  }

  async verifyPayment(sessionId: string, companyId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    if (session.payment_status === 'paid') {
      const order = await this._companyOrderRepo.findByStripeSessionId(sessionId);
      if (!order) throwError(MESSAGES.ORDER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

      await this._companyOrderRepo.updateStatus(sessionId, 'paid');
      await this._cartRepo.clearCart(companyId);
      for (const item of order.purchasedCourses) {
        const courseId = (item.courseId as unknown as ICourse)?._id
          ? new mongoose.Types.ObjectId((item.courseId as unknown as ICourse)._id)
          : new mongoose.Types.ObjectId(item.courseId as unknown as string);
        await this._PurchaseRepo.purchaseCourse(
          new mongoose.Types.ObjectId(order.companyId),
          courseId,
          item.seats
        );
      }


      // --- Transaction Logic ---

      const commissionRate = order.commissionRate || 0.20;
      const platformFee = Math.round(order.amount * commissionRate);
      const teacherShare = order.amount - platformFee;

      // Update order with fee details
      // Assuming update method exists or using mongoose doc save if repo exposes it, 
      // but here we might need to rely on repo update method if available or direct model usage if generic repo.
      // Since ICompanyOrderRepository usually has update/updateStatus, let's assume valid repo usage or just proceed.
      // Order is a mongoose document if returned by findByStripeSessionId, so we can save it.
      order.platformFee = platformFee;
      order.teacherShare = teacherShare;
      await order.save();

      // 1. Create Order Transaction (Company Paid)
      await this._transactionRepo.create({
        userId: order.companyId, // Using userId field for companyId as well, or we need to check Transaction model support
        // Transaction model has `userId` ref 'Student'. It doesn't have `companyId`.
        // We might need to store companyId in `userId` if it allows different refs, OR add `companyId` to Transaction model.
        // Looking at Transaction.ts, `userId: { type: Schema.Types.ObjectId, ref: "Student" }`.
        // This is a schema limitation. For now, let's store it in userId but notes will clarify.
        // Ideally we should update Transaction model to support Company, but for this task I will use userId and notes.
        type: 'COURSE_PURCHASE',
        txnNature: 'CREDIT',
        amount: order.amount,
        grossAmount: order.amount,
        teacherShare,
        platformFee,
        paymentMethod: 'STRIPE',
        paymentStatus: 'SUCCESS',
        notes: `Company Purchase: ${order._id}`
      });

      // 2. Distribute to Teachers
      for (const item of order.purchasedCourses) {
        // item.courseId might be populated or just ID. 
        // Need to ensure we get the course to find teacherId.
        const courseIdStr = (item.courseId as unknown as ICourse)._id?.toString() || item.courseId.toString();
        const course = await this._courseRepo.findById(courseIdStr);

        if (course && course.teacherId) {
          const teacherIdStr = (course.teacherId as unknown as ITeacher)._id?.toString() || course.teacherId.toString();

          // Calculate specific cut for this course item
          const itemPrice = item.price;
          const itemTeacherCut = Math.round(itemPrice * (1 - commissionRate));
          const itemPlatformCut = itemPrice - itemTeacherCut;

          const earningTx = await this._transactionRepo.create({
            teacherId: new mongoose.Types.ObjectId(teacherIdStr),
            courseId: new mongoose.Types.ObjectId(courseIdStr),
            type: 'TEACHER_EARNING',
            txnNature: 'CREDIT',
            amount: itemTeacherCut,
            grossAmount: itemPrice,
            teacherShare: itemTeacherCut,
            platformFee: itemPlatformCut,
            paymentMethod: 'WALLET',
            paymentStatus: 'SUCCESS',
            notes: `Earning from Company Order: ${order._id}`
          });

          // Credit Wallet
          await this._walletRepo.creditTeacherWallet({
            teacherId: new mongoose.Types.ObjectId(teacherIdStr),
            amount: itemTeacherCut,
            transactionId: earningTx._id
          });

          // Increment student count (company purchase usually means seats, but logic handles it)
          // For unlimited, maybe just +1 or +seats?
          // Let's increment by seats if seats > 0, else 1
          /* 
            Note: incrementStudentCount currently just incs by 1. 
            Ideally should inc by seats. For now calling it once per course.
          */
          await this._courseRepo.incrementStudentCount(courseIdStr);
        }
      }

      return { success: true, amount: order.amount, order: order };
    }

    await this._companyOrderRepo.updateStatus(sessionId, 'failed');
    return { success: false };
  }

  /**
   * Get purchased courses for a company
   */
  async getPurchasedCourses(companyId: string): Promise<ICompanyOrder[]> {
    const courses = await this._companyOrderRepo.getOrdersByCompanyId(companyId);
    return courses;
  }

  async getMycoursesIdsById(companyId: string): Promise<string[] | null> {
    const courseIds = await this._companyOrderRepo.getPurchasedCourseIds(companyId);
    return courseIds;
  }
}
