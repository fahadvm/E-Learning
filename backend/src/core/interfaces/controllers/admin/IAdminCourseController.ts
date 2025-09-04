// core/interfaces/controllers/admin/admin.course.controller.interface.ts
import { Request, Response } from 'express';

export interface IAdminCourseController {
    getAllCourses(req: Request, res: Response): Promise<void>;
    getUnverifiedCourses(req: Request, res: Response): Promise<void>;
    getCourseById(req: Request, res: Response): Promise<void>;
    verifyCourse(req: Request, res: Response): Promise<void>;
    rejectCourse(req: Request, res: Response): Promise<void>;
    blockCourse(req: Request, res: Response): Promise<void>;
    unblockCourse(req: Request, res: Response): Promise<void>;
}
