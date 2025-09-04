// core/interfaces/controllers/student/IStudentProfileController.ts
import { Request, Response } from 'express';

export interface IStudentProfileController {
    getProfile(req: Request, res: Response): Promise<void>;
    editProfile(req: Request, res: Response): Promise<void>;
}
