// src/controllers/student/student.course.controller.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IStudentCourseService } from '../../core/interfaces/services/student/IStudentCourseService';
import { TYPES } from '../../core/di/types';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

import { IStudentCourseController } from '../../core/interfaces/controllers/student/IStudentCourseController';
import { AuthRequest } from '../../types/AuthenticatedRequest';

@injectable()
export class StudentCourseController implements IStudentCourseController {
  constructor(@inject(TYPES.StudentCourseService) private readonly _courseService: IStudentCourseService) { }
  getAllCourses = async (req: Request, res: Response) => {

    const {
      search,
      category,
      level,
      language,
      sort = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '8'
    } = req.query;

    const courses = await this._courseService.getAllCourses({
      search: search as string,
      category: category as string,
      level: level as string,
      language: language as string,
      sort: sort as string,
      order: order as string,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    });
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, courses);
  };

  getCourseDetailById = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
    const course = await this._courseService.getCourseDetail(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, course);
  };
  markLessonComplete = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    const { courseId, lessonIndex } = req.params;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    if (!lessonIndex) throwError("Lesson ID is required", STATUS_CODES.BAD_REQUEST);
    console.log(studentId,courseId,lessonIndex)
    const result = await this._courseService.markLessonComplete(studentId,courseId,lessonIndex);
    console.log("here controller will show the final result ", result)
    return sendResponse(res,STATUS_CODES.OK,MESSAGES.COMPLETD_LESSON_MARKED,true,result);
  };

}
