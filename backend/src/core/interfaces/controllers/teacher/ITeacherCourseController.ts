// core/interfaces/controllers/teacher/ITeacherCourseController.ts
import { Request, Response } from 'express';

export interface ITeacherCourseController {
  addCourse(req: Request, res: Response): Promise<void>;
  getMyCourses(req: Request, res: Response): Promise<void>;
  getCourseById(req: Request, res: Response): Promise<void>;
}
