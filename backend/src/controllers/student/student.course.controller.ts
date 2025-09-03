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
      return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true,courses );
    };

    getCourseDetailById = async (req: Request, res: Response) => {
      const { courseId } = req.params;
      if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
      const course = await this._courseService.getCourseDetail(courseId);
      if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
      return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, course);
    };
  }
