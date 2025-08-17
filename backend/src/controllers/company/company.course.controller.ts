import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ICompanyCourseService } from '../../core/interfaces/services/company/ICompanyCourseService';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { TYPES } from '../../core/di/types';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class CompanyCourseController {
  constructor(
    @inject(TYPES.CompanyCourseService) private readonly _courseService: ICompanyCourseService
  ) {}

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
}
