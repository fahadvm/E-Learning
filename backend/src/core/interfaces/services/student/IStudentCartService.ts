// interfaces/services/ICartService.ts
import { ICart } from '../../../../models/Cart';
import { IStudentCartDTO } from '../../../dtos/student/Studnet.cart.Dto';

export interface IStudentCartService {
  getCart(userId: string): Promise<IStudentCartDTO>;
  addToCart(userId: string, courseId: string): Promise<ICart>;
  removeFromCart(userId: string, courseId: string): Promise<ICart | null>;
  clearCart(userId: string): Promise<ICart | null>;
}
