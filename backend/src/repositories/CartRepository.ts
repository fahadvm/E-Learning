import { injectable } from 'inversify';
import { Cart, ICart } from '../models/Cart';
import { ICartRepository } from '../core/interfaces/repositories/ICartRepository';

@injectable()
export class CartRepository implements ICartRepository {
 async getCart(userId: string): Promise<ICart | null> {
  return Cart.findOne({ userId })
    .populate({
      path: 'courses',
      populate: {
        path: 'teacherId',  
        select: 'name email',
      },
    });
}


  async addToCart(userId: string, courseId: string): Promise<ICart> {
    return Cart.findOneAndUpdate(
      { userId },
      { $addToSet: { courses: courseId } }, // prevent duplicates
      { upsert: true, new: true }
    ).populate('courses');
  }

  async removeFromCart(userId: string, courseId: string): Promise<ICart | null> {
    return Cart.findOneAndUpdate(
      { userId },
      { $pull: { courses: courseId } },
      { new: true }
    ).populate('courses');
  }

  async clearCart(userId: string): Promise<ICart | null> {
    return Cart.findOneAndUpdate(
      { userId },
      { $set: { courses: [] } },
      { new: true }
    );
  }
}
