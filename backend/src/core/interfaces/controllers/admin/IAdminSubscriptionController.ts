// core/interfaces/controllers/admin/admin.subscription.controller.interface.ts
import { Request, Response } from 'express';

export interface IAdminSubscriptionController {
    createPlan(req: Request, res: Response): Promise<void>;
    getAllPlans(req: Request, res: Response): Promise<void>;
    getPlanById(req: Request, res: Response): Promise<void>;
    updatePlan(req: Request, res: Response): Promise<void>;
    deletePlan(req: Request, res: Response): Promise<void>;
}
