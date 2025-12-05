import { injectable } from 'inversify';
import { CompanyCart, ICompanyCart } from '../models/CompanyCart';
import mongoose from 'mongoose';
import { ICompanyCartRepository } from '../core/interfaces/repositories/ICompanyCartRepository';

@injectable()
export class CompanyCartRepository implements ICompanyCartRepository {

  async getCart(userId: string): Promise<ICompanyCart | null> {
    return CompanyCart.findOne({ userId })
      .populate({
        path: 'courses.courseId',
        populate: {
          path: 'teacherId',
          select: 'name email'
        }
      });
  }

  async addToCart(
    userId: string,
    courseId: string,
    accessType: "seats" | "unlimited",
    seats: number,
    price: number
  ): Promise<ICompanyCart> {

    // Check if course already exists in cart
    const cart = await CompanyCart.findOne({ userId });

    if (!cart) {
      // cart doesn't exist → create new document
      const newCart = await CompanyCart.create({
        userId,
        courses: [{ courseId, accessType, seats, price }]
      });

      return newCart.populate({
        path: 'courses.courseId',
        populate: { path: 'teacherId', select: 'name email' }
      });
    }

    const existingCourse = cart.courses.find(
      (c) => c.courseId.toString() === courseId
    );

    if (existingCourse) {
      // Update values
      existingCourse.seats = seats;
      existingCourse.accessType = accessType;
      existingCourse.price = price;
    } else {
      // Add new course object
      cart.courses.push({
        courseId: new mongoose.Types.ObjectId(courseId),
        accessType,
        seats,
        price
      });
    }

    await cart.save();

    return cart.populate({
      path: 'courses.courseId',
      populate: { path: 'teacherId', select: 'name email' }
    });
  }

  async removeFromCart(userId: string, courseId: string): Promise<ICompanyCart | null> {
    const cart = await CompanyCart.findOneAndUpdate(
      { userId },
      {
        $pull: {
          courses: { courseId: new mongoose.Types.ObjectId(courseId) }
        }
      },
      { new: true }
    );

    return cart?.populate({
      path: 'courses.courseId',
      populate: { path: 'teacherId', select: 'name email' }
    }) || null;
  }

  async clearCart(userId: string): Promise<ICompanyCart | null> {
    return CompanyCart.findOneAndUpdate(
      { userId },
      { $set: { courses: [] } },
      { new: true }
    );
  }

  async updateSeats(
    companyId: string,
    cartItemId: string,
    seats: number
  ): Promise<ICompanyCart | null> {
    const cart = await CompanyCart.findOne({ companyId });

    if (!cart) return null;

    const item: any = cart.courses.courseId(cartItemId); // subdocument by _id
    if (!item) return null;

    // Calculate per-seat price from current values
    const currentSeats = item.seats || 1;
    const perSeatPrice = currentSeats > 0 ? item.price / currentSeats : item.price;

    item.seats = seats;
    item.price = perSeatPrice * seats;

    await cart.save();
    return cart;
  }
}
