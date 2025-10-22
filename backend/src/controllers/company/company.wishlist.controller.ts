import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { ICompanyWishlistService } from '../../core/interfaces/services/company/ICompanyWishlistService';
import { ICompanyWishlistController } from '../../core/interfaces/controllers/company/ICompanyWishlistController';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { AuthRequest } from '../../types/AuthenticatedRequest';

@injectable()
export class CompanyWishlistController implements ICompanyWishlistController {
    constructor(
        @inject(TYPES.CompanyWishlistService)
        private _wishlistService: ICompanyWishlistService
    ) { }

    async add(req: AuthRequest , res: Response) {

        const { courseId } = req.body;
        const companyId = req.user?.id;
        if(!companyId) throwError(MESSAGES.COMPANY_NOT_FOUND , STATUS_CODES.UNAUTHORIZED);
        const result = await this._wishlistService.addCourse(companyId, courseId);
        if(result)
        return sendResponse(
            res,
            STATUS_CODES.OK,
            MESSAGES.WISHLIST_COURSE_ADDED,
            true,
            result
        );

    }

    async list(req: AuthRequest, res: Response) {

        const companyId = req.user?.id;
        if(!companyId) throwError(MESSAGES.COMPANY_NOT_FOUND , STATUS_CODES.UNAUTHORIZED);
        const result = await this._wishlistService.listWishlist(companyId);

        return sendResponse(
            res,
            STATUS_CODES.OK,
            MESSAGES.WISHLIST_FETCHED,
            true,
            result
        );

    }

    async remove(req: AuthRequest, res: Response) {
        const { courseId } = req.params;
          const companyId = req.user?.id;
        if(!companyId) throwError(MESSAGES.COMPANY_NOT_FOUND , STATUS_CODES.UNAUTHORIZED);
        const result = await this._wishlistService.removeCourse(companyId, courseId);
        return sendResponse(
            res,
            STATUS_CODES.OK,
            MESSAGES.WISHLIST_COURSE_REMOVED,
            true,
            result
        );

    }
}
