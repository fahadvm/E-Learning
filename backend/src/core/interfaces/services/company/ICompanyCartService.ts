// interfaces/services/ICartService.ts
import { ICart } from '../../../../models/Cart';
import { ICompanyCartDTO } from '@/core/dtos/company/Company.Cart.Dto';

export interface ICompanyCartService {
  getCart(userId: string): Promise<ICompanyCartDTO>;
  addToCart(userId: string, courseId: string): Promise<ICart>;
  removeFromCart(userId: string, courseId: string): Promise<ICart | null>;
  clearCart(userId: string): Promise<ICart | null>;
}
