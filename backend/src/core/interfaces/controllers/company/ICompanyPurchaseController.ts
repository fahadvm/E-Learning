import {  Response } from "express";
import { AuthRequest } from "../../../../types/AuthenticatedRequest";
export interface ICompanyPurchaseController  {
  createCheckoutSession(req: AuthRequest, res: Response): Promise<void>;
  verifyPayment(req: AuthRequest, res: Response): Promise<void>;
}
