// src/controllers/teacher.notification.controller.ts
import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/di/types";
import { INotificationService } from "../../core/interfaces/services/shared/INotificationService";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { MESSAGES } from "../../utils/ResponseMessages";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { INotificationController } from "../../core/interfaces/controllers/shared/INotificationService";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.NotificationService) private readonly _notificationService: INotificationService
  ) {}

   async getNotifications(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;
    if (!userId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const notifications = await this._notificationService.getUserNotifications(userId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.NOTIFICATIONS_FETCHED, true, notifications);
  }

    async markNotificationRead(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.body;
    if (!notificationId) throwError(MESSAGES.NOTIFICATION_ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const updatedNotification = await this._notificationService.markAsRead(notificationId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.NOTIFICATION_MARKED_AS_READ, true, updatedNotification);
  }
  
}