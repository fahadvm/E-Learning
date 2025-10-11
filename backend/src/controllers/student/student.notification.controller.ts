import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { IStudentNotificationService } from "../../core/interfaces/services/student/IStudentNotificationService";
import { IStudentNotificationController } from "../../core/interfaces/controllers/student/IStudentNotificationController";
import { AuthRequest } from "../../types/AuthenticatedRequest";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";

@injectable()
export class StudentNotificationController implements IStudentNotificationController {
  constructor(
    @inject(TYPES.StudentNotificationService)
    private readonly _notificationService: IStudentNotificationService
  ) {}

  getNotifications = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const notifications = await this._notificationService.getNotifications(userId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.NOTIFICATIONS_FETCHED, true, notifications);
  };

  markAsRead = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const updated = await this._notificationService.markAsRead(id);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.NOTIFICATION_MARKED_READ, true, updated);
  };

  deleteNotification = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    await this._notificationService.deleteNotification(id);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.NOTIFICATION_DELETED, true, null);
  };
}
