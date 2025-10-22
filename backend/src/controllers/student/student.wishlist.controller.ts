import {  Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IStudentWishlistService } from '../../core/interfaces/services/student/IStudentWishlistService';
import { IStudentWishlistController } from '../../core/interfaces/controllers/student/IStudentWishlistController';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { AuthRequest } from '../../types/AuthenticatedRequest';

@injectable()
export class StudentWishlistController implements IStudentWishlistController {
    constructor(
        @inject(TYPES.StudentWishlistService)
        private _wishlistService: IStudentWishlistService
    ) { }

    async add(req: AuthRequest, res: Response) {

        const { courseId } = req.body;
        const studentId = req.user?.id;
        if (!studentId) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.UNAUTHORIZED);
        const result = await this._wishlistService.addCourse(studentId, courseId);
        if (result)
            return sendResponse(
                res,
                STATUS_CODES.OK,
                MESSAGES.WISHLIST_COURSE_ADDED,
                true,
                result
            );

    }

    async list(req: AuthRequest, res: Response) {

        const studentId = req.user?.id;
        if (!studentId) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.UNAUTHORIZED);
        const result = await this._wishlistService.listWishlist(studentId);

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
        const studentId = req.user?.id;
        if (!studentId) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.UNAUTHORIZED);
        const result = await this._wishlistService.removeCourse(studentId, courseId);

        return sendResponse(
            res,
            STATUS_CODES.OK,
            MESSAGES.WISHLIST_COURSE_REMOVED,
            true,
            result
        );

    }
}
