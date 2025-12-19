import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IAdminStudentService } from '../../core/interfaces/services/admin/IAdminStudentService';
import { Request, Response } from 'express';
import { sendResponse } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { validatePagination } from '../../utils/validatePagination';
import { emitToUser } from '../../config/socket';

@injectable()
export class AdminStudentController {
  constructor(
    @inject(TYPES.AdminStudentService)
    private readonly _studentService: IAdminStudentService
  ) { }

  async getAllStudents(req: Request, res: Response): Promise<void> {
    const { page = '1', limit = '10', search = '', status = 'all' } = req.query;

    const { pageNum, limitNum, error } = validatePagination(String(page), String(limit));
    if (error) return sendResponse(res, STATUS_CODES.BAD_REQUEST, error, false);

    const data = await this._studentService.getAllStudents(
      Number(pageNum),
      Number(limitNum),
      String(search),
      String(status)
    );
    sendResponse(res, STATUS_CODES.OK, MESSAGES.STUDENTS_FETCHED, true, data);
  }

  async getStudentById(req: Request, res: Response): Promise<void> {
    const { studentId } = req.params;
    const result = await this._studentService.getStudentById(studentId);

    sendResponse(res, STATUS_CODES.OK, MESSAGES.STUDENT_DETAILS_FETCHED, true, result);
  }

  async blockStudent(req: Request, res: Response): Promise<void> {
    const { studentId } = req.params;
    const student = await this._studentService.blockStudent(studentId);

    // Real-time logout trigger
    emitToUser(studentId, 'accountBlocked', {
      message: 'Your account has been blocked by the admin. You will be logged out shortly.'
    });

    sendResponse(res, STATUS_CODES.OK, MESSAGES.STUDENT_BLOCKED, true, student);
  }

  async unblockStudent(req: Request, res: Response): Promise<void> {
    const { studentId } = req.params;
    const student = await this._studentService.unblockStudent(studentId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.STUDENT_UNBLOCKED, true, student);
  }
}
