import { Request, Response } from 'express';

export interface IAdminProfileController {
  getProfile(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
  changePassword(req: Request, res: Response): Promise<void>;
  requestEmailChange(req: Request, res: Response): Promise<void>;
  verifyEmailChangeOtp(req: Request, res: Response): Promise<void>;
  addNewAdmin(req: Request, res: Response): Promise<void>;
}
