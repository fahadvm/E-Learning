// core/interfaces/controllers/student/IStudentCourseController.ts
import { Request, Response } from 'express';

export interface IStudentCourseController {
    getAllCourses(req: Request, res: Response): Promise<void>;
    getCourseDetailById(req: Request, res: Response): Promise<void>;
}
