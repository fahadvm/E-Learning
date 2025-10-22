// src/services/teacher/TeacherNotificationService.ts
import { inject, injectable } from 'inversify';
import { INotificationService } from '../../core/interfaces/services/shared/INotificationService';
import { INotificationRepository } from '../../core/interfaces/repositories/INotificationRepository';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { INotification } from '../../models/Notification';

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private readonly _notificationRepository: INotificationRepository
  ) {}

 
  async getUserNotifications(userId: string): Promise<INotification[]> {
    if (!userId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const notifications = await this._notificationRepository.findByUserId(userId);

    return notifications;
  }


  async markAsRead(notificationId: string): Promise<INotification> {
    if (!notificationId) throwError(MESSAGES.NOTIFICATION_ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const updatedNotification = await this._notificationRepository.markAsRead(notificationId);
    if (!updatedNotification) {
      throwError(MESSAGES.NOTIFICATION_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    return updatedNotification;
  }
}
