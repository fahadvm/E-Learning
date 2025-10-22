// interfaces/services/ICartService.ts
import { ICart } from '../../../../models/Cart';
import { ICourse } from '../../../../models/Course';

export interface IStudentCartService {
  getCart(userId: string): Promise<{courses:ICourse[], total:number}>;
  addToCart(userId: string, courseId: string): Promise<ICart>;
  removeFromCart(userId: string, courseId: string): Promise<ICart | null>;
  clearCart(userId: string): Promise<ICart | null>;
}
