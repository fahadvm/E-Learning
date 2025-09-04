// core/interfaces/controllers/admin/admin.employee.controller.interface.ts
import { Request, Response } from 'express';

export interface IAdminEmployeeController {
    getEmployeesByCompany(req: Request, res: Response): Promise<void>;
    getEmployeeById(req: Request, res: Response): Promise<void>;
    blockEmployee(req: Request, res: Response): Promise<void>;
    unblockEmployee(req: Request, res: Response): Promise<void>;
}
