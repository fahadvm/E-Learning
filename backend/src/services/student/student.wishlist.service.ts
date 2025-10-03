import { TYPES } from '../../core/di/types';
import { IWishlist } from '../../models/Wishlist';
import { inject, injectable } from 'inversify';
import { IWishlistRepository } from '../../core/interfaces/repositories/IWishlistRepository';
import { IStudentWishlistService } from '../../core/interfaces/services/student/IStudentWishlistService';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

@injectable()
export class StudentWishlistService implements IStudentWishlistService {
  constructor(
    @inject(TYPES.WishlistRepository) private _wishlistRepo: IWishlistRepository
  ) {}

  async addCourse(studentId: string, courseId: string): Promise<IWishlist> {
    if (!studentId || !courseId)
      throwError(MESSAGES.INVALID_INPUT, STATUS_CODES.BAD_REQUEST);
    const wishlist = await this._wishlistRepo.getWishlist(studentId);
    if (wishlist?.courses.some(c => c._id.toString() === courseId))
      throwError(MESSAGES.WISHLIST_ALREADY_EXISTS, STATUS_CODES.CONFLICT);

    return (
      (await this._wishlistRepo.addToWishlist(studentId, courseId)) ||
      throwError(MESSAGES.WISHLIST_ADD_FAIL, STATUS_CODES.INTERNAL_SERVER_ERROR)
    );
  }

  async listWishlist(studentId: string): Promise<IWishlist | null> {
    if (!studentId)
      throwError(MESSAGES.INVALID_INPUT, STATUS_CODES.BAD_REQUEST);

    const wishlist = await this._wishlistRepo.getWishlist(studentId);
    if (!wishlist || wishlist.courses.length === 0)
      throwError(MESSAGES.WISHLIST_EMPTY, STATUS_CODES.CONFLICT);

    return wishlist;
  }

  async removeCourse(studentId: string, courseId: string): Promise<IWishlist | null> {
    if (!studentId || !courseId)
      throwError(MESSAGES.INVALID_INPUT, STATUS_CODES.BAD_REQUEST);

    const wishlist = await this._wishlistRepo.getWishlist(studentId);
    if (!wishlist) throwError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

    if (!wishlist.courses.some(c => c.toString() === courseId))
      throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    return (
      (await this._wishlistRepo.removeFromWishlist(studentId, courseId)) ||
      throwError(MESSAGES.WISHLIST_REMOVE_FAIL, STATUS_CODES.INTERNAL_SERVER_ERROR)
    );
  }
}
