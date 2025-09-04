// core/interfaces/controllers/company/ICompanyProfileController.ts
import { Request, Response } from 'express';

export interface ICompanyProfileController {
    getProfile(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
}
