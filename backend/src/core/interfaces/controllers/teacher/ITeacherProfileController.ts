// core/interfaces/controllers/teacher/ITeacherProfileController.ts
import { Request, Response } from 'express';

export interface ITeacherProfileController {
  createProfile(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
  getProfile(req: Request, res: Response): Promise<void>;
}
