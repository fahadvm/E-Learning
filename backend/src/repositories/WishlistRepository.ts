import { IWishlistRepository } from '../core/interfaces/repositories/IWishlistRepository';
import { IWishlist, Wishlist } from '../models/Wishlist';
import { injectable } from 'inversify';


@injectable()
export class WishlistRepository implements IWishlistRepository {
  async addToWishlist(userId: string, courseId: string): Promise<IWishlist> {
    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      if (!wishlist.courses.includes(courseId as any)) {
        wishlist.courses.push(courseId as any);
        await wishlist.save();
      }
    } else {
      wishlist = await Wishlist.create({
        userId,
        courses: [courseId],
      });
    }

    return wishlist;
  }

 async  getWishlist(userId : string ): Promise<IWishlist | null >{
    return Wishlist.findOne({userId}).populate('courses').lean();
  }

  async removeFromWishlist(userId : string , courseId : string ): Promise<IWishlist | null>{
    const wishlist = await Wishlist.findOneAndUpdate({userId}, {$pull :{courses : courseId}},{new:true}).populate('courses');
    return wishlist?.toObject() || null; 
  }
}