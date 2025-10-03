import { ICart } from '../../../models/Cart';

export interface ICartRepository {
  getCart(userId: string): Promise<ICart | null>;
  addToCart(userId: string, courseId: string): Promise<ICart>;
  removeFromCart(userId: string, courseId: string): Promise<ICart | null>;
  clearCart(userId: string): Promise<ICart | null>;
}
