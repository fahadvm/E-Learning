import { inject, injectable } from 'inversify';
import { Response } from 'express';

import { ITeacherCourseService } from '../../core/interfaces/services/teacher/ITeacherCourseService';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse } from '../../utils/ResANDError';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { ITeacherCourseController } from '../../core/interfaces/controllers/teacher/ITeacherCourseController';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { CreateCourseRequest } from '../../types/filter/fiterTypes';

@injectable()
export class TeacherCourseController implements ITeacherCourseController {
  constructor(
    @inject(TYPES.TeacherCourseService) private readonly _courseService: ITeacherCourseService
  ) { }

  async addCourse(req: CreateCourseRequest, res: Response): Promise<void> {

    const created = await this._courseService.createCourse(req);
    sendResponse(res, STATUS_CODES.CREATED, MESSAGES.COURSE_CREATED, true, created);
  }

  async getMyCourses(req: AuthRequest, res: Response): Promise<void> {
    const teacherId = req.user?.id;
    if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const courses = await this._courseService.getCoursesByTeacherId(teacherId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, courses);
  }

  async getCourseById(req: AuthRequest, res: Response): Promise<void> {
    const { courseId } = req.params;
    const teacherId = req.user?.id;
    if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const courseDetails = await this._courseService.getCourseByIdWithTeacherId(courseId, teacherId);
    if (!courseDetails) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, courseDetails);
  }









  async uploadResource(req: AuthRequest, res: Response): Promise<void> {
    const { courseId } = req.params;
    const { title } = req.body;
    const file = req.file;
    if (!file) return throwError(MESSAGES.FILE_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const resource = await this._courseService.uploadResource(courseId, title, file);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.RESOURCE_UPLOADED, true, resource);
  }
  async deleteResource(req: AuthRequest, res: Response): Promise<void> {
    const { resourceId } = req.params;
    if (!resourceId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const deleted = await this._courseService.deleteResource(resourceId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.RESOURCE_DELETED, true, deleted);
  }




  async getResources(req: AuthRequest, res: Response): Promise<void> {
    const { courseId } = req.params;
    if (!courseId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const resources = await this._courseService.getResources(courseId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.RESOURCES_FETCHED, true, resources);
  }

  async editCourse(req: AuthRequest, res: Response): Promise<void> {
    const { courseId } = req.params;
    const teacherId = req.user?.id;
    if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const updated = await this._courseService.editCourse(courseId, teacherId, req as any);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_UPDATED, true, updated);
  }
}
