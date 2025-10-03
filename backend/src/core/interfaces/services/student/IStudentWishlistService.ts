import { IWishlist } from '../../../../models/Wishlist';

export interface IStudentWishlistService {
  addCourse(studentId: string, courseId: string): Promise<IWishlist>;
  listWishlist(studentId: string): Promise<IWishlist | null>;
  removeCourse(studentId: string, courseId: string): Promise<IWishlist | null>;
}
