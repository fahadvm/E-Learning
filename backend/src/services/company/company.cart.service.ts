// src/services/company/company.cart.service.ts
import { inject, injectable } from 'inversify';
import { ICompanyCartService } from '../../core/interfaces/services/company/ICompanyCartService';
import { ICartRepository } from '../../core/interfaces/repositories/ICartRepository';
import { TYPES } from '../../core/di/types';
import { ICourse } from '../../models/Course';
import { companyCartDto , ICompanyCartDTO } from '../../core/dtos/company/Company.Cart.Dto';
import { IWishlistRepository } from '../../core/interfaces/repositories/IWishlistRepository';

@injectable()
export class CompanyCartService implements ICompanyCartService {
    constructor(
    @inject(TYPES.CartRepository) private readonly _cartRepo: ICartRepository,
    @inject(TYPES.WishlistRepository) private readonly _wishlistRepo: IWishlistRepository
  ) {}

  async getCart(userId: string): Promise<ICompanyCartDTO> {
  const cart = await this._cartRepo.getCart(userId);

  if (!cart || cart.courses.length === 0) {
    return { courses: [], total: 0 };
  }

  const courses = cart.courses as ICourse[];
  const total = courses.reduce((sum, course) => sum + (course.price ?? 0), 0);

  return companyCartDto(courses, total);
}



  async addToCart(userId: string, courseId: string) {
    this._wishlistRepo.removeFromWishlist(userId,courseId);
    return this._cartRepo.addToCart(userId, courseId);
  }

  async removeFromCart(userId: string, courseId: string) {
    return this._cartRepo.removeFromCart(userId, courseId);
  }

  async clearCart(userId: string) {
    return this._cartRepo.clearCart(userId);
  }
}
