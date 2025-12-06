// core/interfaces/controllers/teacher/ITeacherCourseController.ts
import { Request, Response } from 'express';
import { CreateCourseRequest } from '../../../../types/filter/fiterTypes';
import { AuthRequest } from '../../../../types/AuthenticatedRequest';

export interface ITeacherCourseController {
  addCourse(req: CreateCourseRequest, res: Response): Promise<void>;
  uploadResource(req: AuthRequest, res: Response): Promise<void>;
  deleteResource(req: AuthRequest, res: Response): Promise<void>;
  getResources(req: AuthRequest, res: Response): Promise<void>;
  editCourse(req: AuthRequest, res: Response): Promise<void>;
}
