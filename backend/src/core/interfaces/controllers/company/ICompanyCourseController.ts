// core/interfaces/controllers/company/ICompanyCourseController.ts
import { Request, Response } from 'express';

export interface ICompanyCourseController {
    getAllCourses(req: Request, res: Response): Promise<void>;
    getCourseDetailById(req: Request, res: Response): Promise<void>;
}
