// src/controllers/admin/admin.course.controller.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAdminCourseService } from '../../core/interfaces/services/admin/IAdminCourseService';
import { TYPES } from '../../core/di/types';
import { sendResponse } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { IAdminCourseController } from '../../core/interfaces/controllers/admin/IAdminCourseController';

@injectable()
export class AdminCourseController implements IAdminCourseController{
  constructor(
    @inject(TYPES.AdminCourseService) private readonly _adminCourseService: IAdminCourseService
  ) { }

  async getAllCourses(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const courses = await this._adminCourseService.getAllCourses(page, limit, search);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, courses);
  }

  async getUnverifiedCourses(req: Request, res: Response) {
    const courses = await this._adminCourseService.getUnverifiedCourses();
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, courses);
  }

  async getCourseById(req: Request, res: Response) {
    const course = await this._adminCourseService.getCourseById(req.params.courseId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, course);
  }

  async verifyCourse(req: Request, res: Response) {
    const course = await this._adminCourseService.verifyCourse(req.params.courseId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, course);
  }

  async rejectCourse(req: Request, res: Response) {
    const course = await this._adminCourseService.rejectCourse(req.params.courseId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, course);
  }

  async blockCourse(req: Request, res: Response) {
    const course = await this._adminCourseService.blockCourse(req.params.courseId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, course);
  }

  async unblockCourse(req: Request, res: Response) {
    const course = await this._adminCourseService.unblockCourse(req.params.courseId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, course);
  }
}
