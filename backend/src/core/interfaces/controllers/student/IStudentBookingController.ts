
import { Request, Response} from 'express';
import { AuthRequest } from '../../../../types/AuthenticatedRequest';

export interface IStudentBookingController {
  bookSlot(req: Request, res: Response): Promise<void>;
  cancelBooking(req: Request, res: Response): Promise<void>;
  approveBooking(req: Request, res: Response): Promise<void>;
  payBooking(req: Request, res: Response): Promise<void>;
  getHistory(req: Request, res: Response): Promise<void>;
  bookingDetails(req: Request, res: Response): Promise<void>;
  ScheduledCalls(req: AuthRequest, res: Response): Promise<void>;
}
