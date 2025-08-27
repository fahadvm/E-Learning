import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IStudentProfileService } from '../../core/interfaces/services/student/IStudentProfileService';
import { TYPES } from '../../core/di/types';
import { decodeToken } from '../../utils/JWTtoken';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

@injectable()
export class StudentProfileController {
  constructor(
    @inject(TYPES.StudentProfileService)
    private readonly _studentProfileService: IStudentProfileService
  ) {}

  getProfile = async (req: Request, res: Response) => {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const student = await this._studentProfileService.getProfile(decoded.id);
    if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.STUDENT_DETAILS_FETCHED, true, student);
  };

  editProfile = async (req: Request, res: Response) => {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const updated = await this._studentProfileService.updateStudentProfile(decoded.id, req.body);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PROFILE_UPDATED, true, updated);
  };
}
