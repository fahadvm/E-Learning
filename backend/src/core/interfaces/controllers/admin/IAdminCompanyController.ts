// core/interfaces/controllers/admin/admin.company.controller.interface.ts
import { Request, Response } from 'express';

export interface IAdminCompanyController {
    getAllCompanies(req: Request, res: Response): Promise<void>;
    getUnverifiedCompanies(req: Request, res: Response): Promise<void>;
    verifyCompany(req: Request, res: Response): Promise<void>;
    getCompayById(req: Request, res: Response): Promise<void>;
    getEmployeeById(req: Request, res: Response): Promise<void>;
    rejectCompany(req: Request, res: Response): Promise<void>;
    blockCompany(req: Request, res: Response): Promise<void>;
    unblockCompany(req: Request, res: Response): Promise<void>;
    approveAllCompanies(req: Request, res: Response): Promise<void>;
    rejectAllCompanies(req: Request, res: Response): Promise<void>;
}
