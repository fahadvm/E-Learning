import { TYPES } from '../../core/di/types';
import { IWishlist } from '../../models/Wishlist';
import { inject, injectable } from 'inversify';
import { IWishlistRepository } from '../../core/interfaces/repositories/IWishlistRepository';
import { ICompanyWishlistService } from '../../core/interfaces/services/company/ICompanyWishlistService';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

@injectable()
export class CompanyWishlistService implements ICompanyWishlistService {
  constructor(
    @inject(TYPES.WishlistRepository) private _wishlistRepo: IWishlistRepository
  ) { }

  async addCourse(companyId: string, courseId: string): Promise<IWishlist> {
    if (!companyId || !courseId)
      throwError(MESSAGES.INVALID_INPUT, STATUS_CODES.BAD_REQUEST);
    const wishlist = await this._wishlistRepo.getWishlist(companyId);
    if (wishlist?.courses.some(c => c._id.toString() === courseId))
      throwError(MESSAGES.WISHLIST_ALREADY_EXISTS, STATUS_CODES.CONFLICT);

    return (
      (await this._wishlistRepo.addToWishlist(companyId, courseId)) ||
      throwError(MESSAGES.WISHLIST_ADD_FAIL, STATUS_CODES.INTERNAL_SERVER_ERROR)
    );
  }

  async listWishlist(companyId: string): Promise<IWishlist | null> {
    if (!companyId)
      throwError(MESSAGES.INVALID_INPUT, STATUS_CODES.BAD_REQUEST);

    const wishlist = await this._wishlistRepo.getWishlist(companyId);
    if (!wishlist || wishlist.courses.length === 0)
      throwError(MESSAGES.WISHLIST_EMPTY, STATUS_CODES.CONFLICT);

    return wishlist;
  }

  async removeCourse(companyId: string, courseId: string): Promise<IWishlist | null> {
    if (!companyId || !courseId)
      throwError(MESSAGES.INVALID_INPUT, STATUS_CODES.BAD_REQUEST);


    console.log(companyId, courseId)

    const wishlist = await this._wishlistRepo.getWishlist(companyId);
    if (!wishlist) throwError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

    if (!wishlist.courses.some(c => c._id.toString() === courseId))
      throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    return (
      (await this._wishlistRepo.removeFromWishlist(companyId, courseId)) ||
      throwError(MESSAGES.WISHLIST_REMOVE_FAIL, STATUS_CODES.INTERNAL_SERVER_ERROR)
    );
  }
}
