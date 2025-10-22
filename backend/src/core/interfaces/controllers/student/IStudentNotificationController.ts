import { Request, Response } from 'express';

export interface IStudentNotificationController {
  getNotifications(req: Request, res: Response): Promise<void>;
  markAsRead(req: Request, res: Response): Promise<void>;
  deleteNotification(req: Request, res: Response): Promise<void>;
}
