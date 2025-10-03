// core/interfaces/controllers/company/ICompanyEmployeeController.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../../../../types/AuthenticatedRequest';

export interface ICompanyEmployeeController {
    getAllEmployees(req: Request, res: Response): Promise<void>;
    getEmployeeById(req: Request, res: Response): Promise<void>;
    blockEmployee(req: Request, res: Response): Promise<void>;
    updateEmployee(req: Request, res: Response): Promise<void>;
    getRequestedEmployees(req: AuthRequest, res: Response): Promise<void>
    approveEmployee(req: AuthRequest, res: Response): Promise<void>
    rejectEmployee(req: AuthRequest, res: Response): Promise<void>
}
