import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../core/di/types';
import { IAdminTeacherService } from '../../core/interfaces/services/admin/IAdminTeacherService';
import { sendResponse } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { validatePagination } from '../../utils/validatePagination';

@injectable()
export class AdminTeacherController {
    constructor(
        @inject(TYPES.AdminTeacherService) 
        private readonly _teacherService: IAdminTeacherService
    ) {}

    async getAllTeachers(req: Request, res: Response): Promise<void> {
        const { page = '1', limit = '10', search = '' } = req.query;
        const { pageNum, limitNum, error } = validatePagination(
            page as string,
            limit as string
        );

        if (error) {
            return sendResponse(res, STATUS_CODES.BAD_REQUEST, error, false);
        }

        const result = await this._teacherService.getAllTeachers(
            pageNum!,
            limitNum!,
            String(search || '')
        );
        sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHERS_FETCHED, true, result);
    }

    async getUnverifiedTeachers(req: Request, res: Response): Promise<void> {
        const result = await this._teacherService.getUnverifiedTeachers();
        sendResponse(res, STATUS_CODES.OK, MESSAGES.UNVERIFIED_TEACHERS_FETCHED, true, result);
    }

    async verifyTeacher(req: Request, res: Response): Promise<void> {
        const { teacherId } = req.params;
        const updated = await this._teacherService.verifyTeacher(teacherId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.VERIFIED, true, updated);
    }

    async rejectTeacher(req: Request, res: Response): Promise<void> {
        const { teacherId } = req.params;
        const updated = await this._teacherService.rejectTeacher(teacherId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.REJECTED, true, updated);
    }

    async blockTeacher(req: Request, res: Response): Promise<void> {
        const { teacherId } = req.params;
        const updated = await this._teacherService.blockTeacher(teacherId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHER_BLOCKED, true, updated);
    }

    async unblockTeacher(req: Request, res: Response): Promise<void> {
        const { teacherId } = req.params;
        const updated = await this._teacherService.unblockTeacher(teacherId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHER_UNBLOCKED, true, updated);
    }
}
