import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IAdminStudentService } from '../../core/interfaces/services/admin/IAdminStudentService';
import { Request, Response } from 'express';
import { sendResponse } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { validatePagination } from '../../utils/validatePagination';
import { IAdminStudentController } from '../../core/interfaces/controllers/admin/IAdminStudentController';

@injectable()
export class AdminStudentController implements IAdminStudentController {
    constructor(
        @inject(TYPES.AdminStudentService)
        private readonly _studentService: IAdminStudentService
    ) {}

    async getAllStudents(req: Request, res: Response): Promise<void> {
        const { page = '1', limit = '5', search = '' } = req.query;
        const { pageNum, limitNum, error } = validatePagination( String(page),String(limit)
   );

        if (error || pageNum === null || limitNum === null) {
            return sendResponse(res, STATUS_CODES.BAD_REQUEST, error, false);
        }

        const result = await this._studentService.getAllStudents(
            pageNum,
            limitNum,
            String(search || '')
        );

        sendResponse(res, STATUS_CODES.OK, MESSAGES.STUDENTS_FETCHED, true, result);
    }

    async getStudentById(req: Request, res: Response): Promise<void> {
        const { studentId } = req.params;
        const student = await this._studentService.getStudentById(studentId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.STUDENT_DETAILS_FETCHED, true, student);
    }

    async blockStudent(req: Request, res: Response): Promise<void> {
        const { studentId } = req.params;
        const updatedStudent = await this._studentService.blockStudent(studentId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.STUDENT_BLOCKED, true, updatedStudent);
    }

    async unblockStudent(req: Request, res: Response): Promise<void> {
        const { studentId } = req.params;
        const updatedStudent = await this._studentService.unblockStudent(studentId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.STUDENT_UNBLOCKED, true, updatedStudent);
    }
}
