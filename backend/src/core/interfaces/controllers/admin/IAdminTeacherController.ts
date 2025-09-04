// core/interfaces/controllers/admin/admin.teacher.controller.interface.ts
import { Request, Response } from 'express';

export interface IAdminTeacherController {
    getAllTeachers(req: Request, res: Response): Promise<void>;
    getTeacherById(req: Request, res: Response): Promise<void>;
    getTeacherCourses(req: Request, res: Response): Promise<void>;
    getUnverifiedTeachers(req: Request, res: Response): Promise<void>;
    verifyTeacher(req: Request, res: Response): Promise<void>;
    rejectTeacher(req: Request, res: Response): Promise<void>;
    blockTeacher(req: Request, res: Response): Promise<void>;
    unblockTeacher(req: Request, res: Response): Promise<void>;
}
