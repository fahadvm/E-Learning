import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { ITeacherCourseService } from '../../core/interfaces/services/teacher/ITeacherCourseService';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse } from '../../utils/ResANDError';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { ITeacherCourseController } from '../../core/interfaces/controllers/teacher/ITeacherCourseController';

@injectable()
export class TeacherCourseController implements ITeacherCourseController{
  constructor(
    @inject(TYPES.TeacherCourseService) private readonly _courseService: ITeacherCourseService
  ) {}

  async addCourse(req: Request, res: Response): Promise<void> {

    const created = await this._courseService.createCourse(req);
    sendResponse(res, STATUS_CODES.CREATED, MESSAGES.COURSE_CREATED, true, created);
  }

  async getMyCourses(req: Request, res: Response): Promise<void> {
    const teacherId = req.user?.id;
    if (!teacherId) throwError( MESSAGES.UNAUTHORIZED ,STATUS_CODES.UNAUTHORIZED);

    const courses = await this._courseService.getCoursesByTeacherId(teacherId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, courses);
  }

  async getCourseById(req: Request, res: Response): Promise<void> {
    const { courseId } = req.params;
    const teacherId = req.user?.id;
    if (!teacherId) throwError( MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED);

    const courseDetails = await this._courseService.getCourseByIdWithTeacherId(courseId, teacherId);
    if (!courseDetails) throwError( MESSAGES.COURSE_NOT_FOUND ,STATUS_CODES.NOT_FOUND);

    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, courseDetails);
  }
}
