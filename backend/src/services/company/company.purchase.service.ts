import { injectable, inject } from "inversify";
import { ICompanyPurchaseService } from "../../core/interfaces/services/company/ICompanyPurchaseService";
import { stripe } from "../../config/stripe";
import dotenv from "dotenv";
import { TYPES } from "../../core/di/types";
import { IOrderRepository } from "../../core/interfaces/repositories/IOrderRepository";
import { ICartRepository } from "../../core/interfaces/repositories/ICartRepository";
import { ICourseRepository } from "../../core/interfaces/repositories/ICourseRepository";
import mongoose from "mongoose";
import { ICompanyRepository } from "../../core/interfaces/repositories/ICompanyRepository";
import { ICompanyOrderRepository } from "../../core/interfaces/repositories/ICompanyOrderRepository";

dotenv.config();

@injectable()
export class CompanyPurchaseService implements ICompanyPurchaseService {
  constructor(
    @inject(TYPES.CompanyOrderRepository) private readonly _companyOrderRepo: ICompanyOrderRepository,
    @inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository,
    @inject(TYPES.CartRepository) private readonly _cartRepo: ICartRepository,
    @inject(TYPES.CompanyRepository) private readonly _companyRepo: ICompanyRepository
  ) { }

  /**
   * Create a Stripe Checkout session for a company
   */
  async createCheckoutSession(courseIds: string[], companyId: string, amount: number) {
    console.log("coming from controllers", courseIds, companyId, amount)
    const Company = await this._companyRepo.findById(companyId)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: Company?.name || "unknown",
              description: "Purchase courses from devnext!",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/company/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/company/checkout/cancel`,
    });

    const companyIdObj = new mongoose.Types.ObjectId(companyId);
    const courseObjIds = courseIds.map(id => new mongoose.Types.ObjectId(id));


    await this._companyOrderRepo.create({
      companyId: companyIdObj,
      courses: courseObjIds,
      stripeSessionId: session.id,
      amount,
      currency: "inr",
      status: "created",
    });

    return { url: session.url };
  }


  async verifyPayment(sessionId: string, companyId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });


    if (session.payment_status === "paid") {
      await this._companyOrderRepo.updateStatus(sessionId, "paid");
      await this._cartRepo.clearCart(companyId);
      const order = await this._companyOrderRepo.findByStripeSessionId(sessionId)
      return { success: true , amount : order?.amount };
    }

    await this._companyOrderRepo.updateStatus(sessionId, "failed");
    return { success: false };
  }

  /**
   * Get purchased courses for a company
   */
  async getPurchasedCourses(companyId: string) {
    return await this._companyOrderRepo.getOrdersByCompanyId(companyId);
  }
}
