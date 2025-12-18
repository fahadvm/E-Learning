import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { IStudentTeacherService } from '../../core/interfaces/services/student/IStudentTeacherService';
import { IStudentTeacherController } from '../../core/interfaces/controllers/student/IStudentTeacherController';
import { TYPES } from '../../core/di/types';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { AuthRequest } from '../../types/AuthenticatedRequest';

@injectable()
export class StudentTeacherController implements IStudentTeacherController {
  constructor(
    @inject(TYPES.StudentTeacherService)
    private readonly _teacherService: IStudentTeacherService
  ) {}

  getProfile = async (req: AuthRequest, res: Response) => {
    const teacherId = req.params.teacherId;
    if (!teacherId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
   


    const profile = await this._teacherService.getProfile(teacherId );
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHER_PROFILE_FETCHED, true, profile);
  };

  getAvailability = async (req: AuthRequest, res: Response) => {
    const teacherId = req.params.teacherId;
    if (!teacherId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const availability = await this._teacherService.getAvailability(teacherId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.TEACHER_AVAILABILITY_FETCHED, true, availability);
  };
    getTopTeacher = async (_req: Request, res: Response) => {
    const teachers = await this._teacherService.getTopTeachers();
    return sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.TOP_TEACHERS_FETCHED,
      true,
      teachers
    );
  };
}
