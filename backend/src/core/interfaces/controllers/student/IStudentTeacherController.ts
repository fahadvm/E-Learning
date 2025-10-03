import { Response } from 'express';
import { AuthRequest } from '../../../../types/AuthenticatedRequest';

export interface IStudentTeacherController {
  getProfile(req: AuthRequest, res: Response): Promise<void>;
  getAvailability(req: AuthRequest, res: Response): Promise<void>;
}
