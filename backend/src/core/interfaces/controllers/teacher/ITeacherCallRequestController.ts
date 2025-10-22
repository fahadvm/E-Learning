import { Response } from 'express';
import { AuthRequest } from '../../../../types/AuthenticatedRequest';
export interface ITeacherCallRequestController {
  getPendingRequests(req: AuthRequest, res: Response): Promise<void>
  getConfirmedRequests(req: AuthRequest, res: Response): Promise<void>
  getRequestDetails(req: AuthRequest, res: Response): Promise<void>
  approveRequest(req: AuthRequest, res: Response): Promise<void>
  rejectRequest(req: AuthRequest, res: Response): Promise<void>
}
