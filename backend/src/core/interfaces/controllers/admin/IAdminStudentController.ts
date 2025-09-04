// core/interfaces/controllers/admin/admin.student.controller.interface.ts
import { Request, Response } from 'express';

export interface IAdminStudentController {
    getAllStudents(req: Request, res: Response): Promise<void>;
    getStudentById(req: Request, res: Response): Promise<void>;
    blockStudent(req: Request, res: Response): Promise<void>;
    unblockStudent(req: Request, res: Response): Promise<void>;
}
