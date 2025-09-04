// core/interfaces/controllers/teacher/ITeacherAuthController.ts
import { Request, Response } from 'express';

export interface ITeacherAuthController {
  signup(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  // googleAuth(req: Request, res: Response): Promise<void>; // optional, if used
  sendForgotPasswordOtp(req: Request, res: Response): Promise<void>;
  verifyForgotOtp(req: Request, res: Response): Promise<void>;
  setNewPassword(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
}
