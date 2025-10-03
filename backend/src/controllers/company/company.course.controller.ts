import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ICompanyCourseService } from '../../core/interfaces/services/company/ICompanyCourseService';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { TYPES } from '../../core/di/types';
import { MESSAGES } from '../../utils/ResponseMessages';
import { ICompanyCourseController } from '../../core/interfaces/controllers/company/ICompanyCourseController';
import { AuthRequest } from '../../types/AuthenticatedRequest';

@injectable()
export class CompanyCourseController implements ICompanyCourseController {
  constructor(
    @inject(TYPES.CompanyCourseService) private readonly _courseService: ICompanyCourseService
  ) { }

  async getAllCourses(req: Request, res: Response): Promise<void> {
    const courses = await this._courseService.getAllCourses();
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, courses);
  }

  async getCourseDetailById(req: Request, res: Response): Promise<void> {
    const { courseId } = req.params;
    const course = await this._courseService.getCourseDetail(courseId);

    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, course);
  }

  async getMyCourses(req: AuthRequest, res: Response): Promise<void> {
    const companyId = req.user?.id
    if (!companyId) { throwError(MESSAGES.ALL_FIELDS_REQUIRED, STATUS_CODES.BAD_REQUEST); }
    const courses = await this._courseService.getMycoursesById(companyId)
    if (!courses) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, courses);

  }
  async getMyCourseDetails(req: AuthRequest, res: Response): Promise<void> {
    const companyId = req.user?.id
    const courseId = req.params.courseId
    if (!companyId || !courseId) { throwError(MESSAGES.ALL_FIELDS_REQUIRED, STATUS_CODES.BAD_REQUEST); }
    const courses = await this._courseService.getMycourseDetailsById(companyId ,courseId)
    if (!courses) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, courses);

  }
}
