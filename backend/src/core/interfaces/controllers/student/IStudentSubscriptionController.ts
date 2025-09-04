// core/interfaces/controllers/student/IStudentSubscriptionController.ts
import { Request, Response } from 'express';

export interface IStudentSubscriptionController {
    getAllStudentPlans(req: Request, res: Response): Promise<void>;
}
