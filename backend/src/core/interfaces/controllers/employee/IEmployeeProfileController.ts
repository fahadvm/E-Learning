// core/interfaces/controllers/employee/IEmployeeProfileController.ts
import { Request, Response } from 'express';

export interface IEmployeeProfileController {
    getProfile(req: Request, res: Response): Promise<void>;
    editProfile(req: Request, res: Response): Promise<void>;
}
