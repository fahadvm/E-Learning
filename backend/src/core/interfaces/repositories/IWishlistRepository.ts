import { IWishlist } from '../../../models/Wishlist';

export interface IWishlistRepository {
  addToWishlist(studentId: string, courseId: string): Promise<IWishlist>;
  getWishlist(studentId: string): Promise<IWishlist | null>;
  removeFromWishlist(studentId: string, courseId: string): Promise<IWishlist | null>;
}
