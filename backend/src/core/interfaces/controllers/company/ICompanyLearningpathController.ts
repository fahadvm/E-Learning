import { Response } from 'express';
import { AuthRequest } from '../../../../types/AuthenticatedRequest';

export interface ICompanyLearningPathController {
  create(req: AuthRequest, res: Response): Promise<void>;
  getAll(req: AuthRequest, res: Response): Promise<void>;
  getOne(req: AuthRequest, res: Response): Promise<void>;
  update(req: AuthRequest, res: Response): Promise<void>;
  delete(req: AuthRequest, res: Response): Promise<void>;
}