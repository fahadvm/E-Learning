// core/interfaces/controllers/teacher/ITeacherCourseController.ts
import { Request, Response } from 'express';
import { CreateCourseRequest } from '../../../../types/filter/fiterTypes';

export interface ITeacherCourseController {
  addCourse(req: CreateCourseRequest, res: Response): Promise<void>;
  getMyCourses(req: Request, res: Response): Promise<void>;
  getCourseById(req: Request, res: Response): Promise<void>;
}
