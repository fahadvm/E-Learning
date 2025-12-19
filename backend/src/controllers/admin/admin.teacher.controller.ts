// controllers/admin/admin.teacher.controller.ts
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../core/di/types';
import { IAdminTeacherService } from '../../core/interfaces/services/admin/IAdminTeacherService';
import { sendResponse } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { validatePagination } from '../../utils/validatePagination';
import { IAdminTeacherController } from '../../core/interfaces/controllers/admin/IAdminTeacherController';
import { emitToUser } from '../../config/socket';

@injectable()
export class AdminTeacherController implements IAdminTeacherController {
  constructor(
    @inject(TYPES.AdminTeacherService)
    private readonly _teacherService: IAdminTeacherService
  ) { }

  async getAllTeachers(req: Request, res: Response): Promise<void> {
    const { page = '1', limit = '10', search = '', status = '' } = req.query;
    const { pageNum, limitNum, error } = validatePagination(String(page), String(limit));
    if (error) return sendResponse(res, STATUS_CODES.BAD_REQUEST, error, false);

    const result = await this._teacherService.getAllTeachers(pageNum!, limitNum!, String(search || ''), String(status || ''));
    sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHERS_FETCHED, true, result);
  }

  async getVerificationRequests(req: Request, res: Response): Promise<void> {
    const { page = '1', limit = '10', search = '' } = req.query;
    const { pageNum, limitNum, error } = validatePagination(String(page), String(limit));
    if (error) return sendResponse(res, STATUS_CODES.BAD_REQUEST, error, false);

    const result = await this._teacherService.getVerificationRequests(pageNum!, limitNum!, String(search || ''));
    sendResponse(res, STATUS_CODES.OK, MESSAGES.VERIFICATION_REQUESTS_FETCHED, true, result);
  }

  async getTeacherById(req: Request, res: Response): Promise<void> {
    const { teacherId } = req.params;
    const teacher = await this._teacherService.getTeacherById(teacherId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHER_DETAILS_FETCHED, true, teacher);
  }



  async verifyTeacher(req: Request, res: Response): Promise<void> {
    const { teacherId } = req.params;
    const updated = await this._teacherService.verifyTeacher(teacherId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.VERIFIED, true, updated);
  }

  async rejectTeacher(req: Request, res: Response): Promise<void> {
    const { teacherId } = req.params;
    const { reason } = req.body;
    const updated = await this._teacherService.rejectTeacher(teacherId, String(reason || ''));
    sendResponse(res, STATUS_CODES.OK, MESSAGES.REJECTED, true, updated);
  }

  async blockTeacher(req: Request, res: Response): Promise<void> {
    const { teacherId } = req.params;
    const updated = await this._teacherService.blockTeacher(teacherId);

    // Real-time logout trigger
    emitToUser(teacherId, 'accountBlocked', {
      message: 'Your account has been blocked by the admin. You will be logged out shortly.'
    });

    sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHER_BLOCKED, true, updated);
  }

  async unblockTeacher(req: Request, res: Response): Promise<void> {
    const { teacherId } = req.params;
    const updated = await this._teacherService.unblockTeacher(teacherId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHER_UNBLOCKED, true, updated);
  }
}
