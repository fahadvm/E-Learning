import { Request, Response } from 'express';
import { ITeacherProfileService } from '../../core/interfaces/services/teacher/ITeacherProfileService';
import { injectable, inject } from 'inversify';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { decodeToken } from '../../utils/JWTtoken';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { ITeacherProfileController } from '../../core/interfaces/controllers/teacher/ITeacherProfileController';
import { AuthRequest } from '../../types/AuthenticatedRequest';

@injectable()
export class TeacherProfileController implements ITeacherProfileController {
  constructor(@inject(TYPES.TeacherProfileService) private _teacherservice: ITeacherProfileService) { }

  async createProfile(req: Request, res: Response) {
    const result = await this._teacherservice.createProfile(req.body);
    return sendResponse(res, STATUS_CODES.CREATED, MESSAGES.PROFILE_UPDATED, true, result);
  }

  async updateProfile(req: Request, res: Response) {

    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const result = await this._teacherservice.updateProfile(decoded.id, req.body);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PROFILE_UPDATED, true, result);
  }

  async getProfile(req: Request, res: Response) {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const teacher = await this._teacherservice.getProfile(decoded.id);
    if (!teacher) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHER_DETAILS_FETCHED, true, teacher);
  }

  async sendVerificationRequest(req: AuthRequest, res: Response) {
    const teacherId = req.user?.id;
    const file = req.file;
    if (!file) throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);
    if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const teacher = await this._teacherservice.sendVerificationRequest(teacherId ,file)
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHER_DETAILS_FETCHED, true, teacher);
    
  }
}
