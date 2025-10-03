// core/interfaces/controllers/company/ICompanyCourseController.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../../../../types/AuthenticatedRequest';

export interface ICompanyCourseController {
    getAllCourses(req: Request, res: Response): Promise<void>;
    getCourseDetailById(req: Request, res: Response): Promise<void>;
    getMyCourses(req: AuthRequest, res: Response): Promise<void>;
    getMyCourseDetails(req: AuthRequest, res: Response): Promise<void>


}
