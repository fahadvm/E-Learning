
import { Request, Response } from 'express';

export interface IAdminOrderController {
getCompanyOrders(req: Request, res: Response): Promise<void> 
getStudentOrders(req: Request, res: Response): Promise<void> 
}
