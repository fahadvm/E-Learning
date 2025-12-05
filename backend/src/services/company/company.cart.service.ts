// src/services/company/company.cart.service.ts
import { inject, injectable } from 'inversify';
import { ICompanyCartService } from '../../core/interfaces/services/company/ICompanyCartService';
import { ICartRepository } from '../../core/interfaces/repositories/ICartRepository';
import { TYPES } from '../../core/di/types';
import { ICourse } from '../../models/Course';
import { companyCartDto, ICompanyCartDTO } from '../../core/dtos/company/Company.Cart.Dto';
import { IWishlistRepository } from '../../core/interfaces/repositories/IWishlistRepository';
import { ICompanyCart, ICompanyCartCourse } from '../../models/CompanyCart';
import { ICompanyCartRepository } from '../../core/interfaces/repositories/ICompanyCartRepository';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

@injectable()
export class CompanyCartService implements ICompanyCartService {
  constructor(
    @inject(TYPES.CompanyCartRepository) private readonly _cartRepo: ICompanyCartRepository,
    @inject(TYPES.WishlistRepository) private readonly _wishlistRepo: IWishlistRepository,
    @inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository
  ) { }

  async getCart(userId: string): Promise<{ courses: ICompanyCartCourse[], total: number }> {
    const cart = await this._cartRepo.getCart(userId);
    if (!cart || cart.courses.length === 0) {
      return { courses: [], total: 0 };
    }
    const courses = cart.courses;
    const total = courses.reduce((sum, course) => sum + (course.price ?? 0), 0);
    return { courses, total };
  }



  async addToCart(userId: string, courseId: string, accessType: "seats" | "unlimited", seats: number): Promise<ICompanyCart> {
    this._wishlistRepo.removeFromWishlist(userId, courseId);
    const course = await this._courseRepo.findById(courseId)
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND)
    const price = course.price ?? 0 * seats;
    return this._cartRepo.addToCart(userId, courseId, accessType, seats, price);
  }

  async removeFromCart(userId: string, courseId: string) {
    return this._cartRepo.removeFromCart(userId, courseId);
  }

  async clearCart(userId: string) {
    return this._cartRepo.clearCart(userId);
  }

  async updateSeat(
    companyId: string,
    cartItemId: string,
    seats: number
  ): Promise<ICompanyCart> {
    // Extra safety validation (frontend also checks)
    if (!Number.isFinite(seats)) {
      throwError(MESSAGES.INVALID_SEAT_COUNT);
    }

    if (seats < 1 || seats > 100) {
      throwError(MESSAGES.INVALID_SEAT_COUNT);
    }

    const updatedCart = await this._cartRepo.updateSeats(
      companyId,
      cartItemId,
      seats
    );

    if (!updatedCart) {
      throwError(MESSAGES.CART_ITEM_NOT_FOUND);
    }

    return updatedCart;
  }
}
