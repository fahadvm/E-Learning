import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { IEmployeeTeacherService } from '../../core/interfaces/services/employee/IEmployeeTeacherService';
import { IEmployeeTeacherController } from '../../core/interfaces/controllers/employee/IEmployeeTeacherController';
import { TYPES } from '../../core/di/types';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { AuthRequest } from '../../types/AuthenticatedRequest';

@injectable()
export class EmployeeTeacherController implements IEmployeeTeacherController {
    constructor(
        @inject(TYPES.EmployeeTeacherService)
        private readonly _teacherService: IEmployeeTeacherService
    ) { }

    getProfile = async (req: AuthRequest, res: Response) => {
        const teacherId = req.params.teacherId;
        if (!teacherId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

        const profile = await this._teacherService.getProfile(teacherId);
        return sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHER_PROFILE_FETCHED, true, profile);
    };

    getTopTeachers = async (req: AuthRequest, res: Response) => {
        const teachers = await this._teacherService.getTopTeachers();
        return sendResponse(res, STATUS_CODES.OK, MESSAGES.TOP_TEACHERS_FETCHED, true, teachers);
    };
}
