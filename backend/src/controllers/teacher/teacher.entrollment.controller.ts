import { Response } from 'express';
import { injectable, inject } from 'inversify';
import { TeacherEnrollmentService } from '../../services/teacher/TeacherEnrollmentService';
import { TYPES } from '../../core/di/types';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { AuthRequest } from '../../types/AuthenticatedRequest';

@injectable()
export class TeacherEnrollmentController {
    constructor(
        @inject(TYPES.TeacherEnrollmentService) private teacherEnrollmentService: TeacherEnrollmentService
    ) { }

    async getEnrollments(req: AuthRequest, res: Response) {
        const teacherId = req.user?.id;
        if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

        const enrollments = await this.teacherEnrollmentService.getEnrollments(teacherId);
        return sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHER_DETAILS_FETCHED, true, enrollments);
    }
}
