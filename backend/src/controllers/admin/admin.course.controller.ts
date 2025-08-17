// src/controllers/admin/admin.course.controller.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAdminCourseService } from '../../core/interfaces/services/admin/IAdminCourseService';
import { TYPES } from '../../core/di/types';

@injectable()
export class AdminCourseController {
  constructor(
    @inject(TYPES.AdminCourseService) private readonly _adminCourseService: IAdminCourseService
  ) {}

  async getAllCourses(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await this._adminCourseService.getAllCourses(page, limit, search);
    res.json(result);
  }

  async getUnverifiedCourses(req: Request, res: Response) {
    const courses = await this._adminCourseService.getUnverifiedCourses();
    res.json(courses);
  }

  async getCourseById(req: Request, res: Response) {
    const course = await this._adminCourseService.getCourseById(req.params.courseId);
    res.json(course);
  }

  async verifyCourse(req: Request, res: Response) {
    const course = await this._adminCourseService.verifyCourse(req.params.courseId);
    res.json(course);
  }

  async rejectCourse(req: Request, res: Response) {
    const course = await this._adminCourseService.rejectCourse(req.params.courseId);
    res.json(course);
  }

  async blockCourse(req: Request, res: Response) {
    const course = await this._adminCourseService.blockCourse(req.params.courseId);
    res.json(course);
  }

  async unblockCourse(req: Request, res: Response) {
    const course = await this._adminCourseService.unblockCourse(req.params.courseId);
    res.json(course);
  }
}
