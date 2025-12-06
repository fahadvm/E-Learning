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

@injectable()
export class CompanyPurchaseService implements ICompanyPurchaseService {
  constructor(
    @inject(TYPES.CompanyOrderRepository) private readonly _companyOrderRepo: ICompanyOrderRepository,
    @inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository,
    @inject(TYPES.CompanyCartRepository) private readonly _cartRepo: ICompanyCartRepository,
    @inject(TYPES.CompanyRepository) private readonly _companyRepo: ICompanyRepository
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
    const courseIds = cart.courses.map(item => item.courseId._id?.toString() || item.courseId.toString());

    const purchasedCourseIds = await this._companyOrderRepo.getPurchasedCourseIds(companyId);
    const duplicates = courseIds.filter(id => purchasedCourseIds.includes(id));

    if (duplicates.length > 0) {
      throwError(MESSAGES.COURSES_ALREADY_PURCHASED, STATUS_CODES.CONFLICT);
    }

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
      await this._companyOrderRepo.updateStatus(sessionId, 'paid');
      await this._cartRepo.clearCart(companyId);
      const order = await this._companyOrderRepo.findByStripeSessionId(sessionId);
      return { success: true, amount: order?.amount, order: order };
    }

    await this._companyOrderRepo.updateStatus(sessionId, 'failed');
    return { success: false };
  }

  /**
   * Get purchased courses for a company
   */
  async getPurchasedCourses(companyId: string): Promise<(ICompanyOrder & { courses: ICourse[] })[]> {
    const courses = await this._companyOrderRepo.getOrdersByCompanyId(companyId);
    console.log("course fetched more", courses)
    return courses
  }

  async getMycoursesIdsById(companyId: string): Promise<string[] | null> {
    const courseIds = await this._companyOrderRepo.getPurchasedCourseIds(companyId);
    console.log("course fetched more", courseIds)
    return courseIds
  }
}
