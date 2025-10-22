// src/core/interfaces/controllers/student/IStudentPurchaseController.ts
import { Response } from 'express';
import { AuthRequest } from '../../../../types/AuthenticatedRequest';

export interface IStudentPurchaseController {
  createOrder(req: AuthRequest, res: Response): Promise<void>;
  verifyPayment(req: AuthRequest, res: Response): Promise<void>;
}
