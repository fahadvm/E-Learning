// core/interfaces/controllers/company/ICompanyAuthController.ts
import { Request, Response } from 'express';

export interface ICompanyAuthController {
    sendOtp(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response): Promise<void>;
    verifyForgotOtp(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
}
