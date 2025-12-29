// core/interfaces/controllers/teacher/ITeacherProfileController.ts
import { Request, Response } from 'express';

export interface ITeacherProfileController {
  createProfile(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
  getProfile(req: Request, res: Response): Promise<void>;
  changePassword(req: Request, res: Response): Promise<void>;
  requestEmailChange(req: Request, res: Response): Promise<void>;
  verifyEmailChangeOtp(req: Request, res: Response): Promise<void>;
}
