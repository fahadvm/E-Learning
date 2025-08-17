// src/controllers/student/student.course.controller.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IStudentCourseService } from '../../core/interfaces/services/student/IStudentCourseService';
import { TYPES } from '../../core/di/types';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

@injectable()
export class StudentCourseController {
  constructor(@inject(TYPES.StudentCourseService) private readonly _courseService: IStudentCourseService) {}

  getAllCourses = async (req: Request, res: Response) => {
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, await this._courseService.getAllCourses());
  };

  getCourseDetailById = async (req: Request, res: Response) => {
    const { courseid } = req.params;
    if (!courseid) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
    const course = await this._courseService.getCourseDetail(courseid);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, course);
  };
}
