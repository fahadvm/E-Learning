import { IWishlist } from '../../../../models/Wishlist';

export interface ICompanyWishlistService {
  addCourse(companyId: string, courseId: string): Promise<IWishlist>;
  listWishlist(companyId: string): Promise<IWishlist | null>;
  removeCourse(companyId: string, courseId: string): Promise<IWishlist | null>;
}
