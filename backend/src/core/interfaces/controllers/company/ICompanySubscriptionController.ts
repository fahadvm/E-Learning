// core/interfaces/controllers/company/ICompanySubscriptionController.ts
import { Request, Response } from 'express';

export interface ICompanySubscriptionController {
    getAllCompanyPlans(req: Request, res: Response): Promise<void>;
}
