// core/interfaces/controllers/company/ICompanyEmployeeController.ts
import { Request, Response } from 'express';

export interface ICompanyEmployeeController {
    addEmployee(req: Request, res: Response): Promise<void>;
    getAllEmployees(req: Request, res: Response): Promise<void>;
    getEmployeeById(req: Request, res: Response): Promise<void>;
    blockEmployee(req: Request, res: Response): Promise<void>;
    updateEmployee(req: Request, res: Response): Promise<void>;
}
