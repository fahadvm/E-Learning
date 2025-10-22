import { injectable, inject } from 'inversify';
import { IStudentNotificationService } from '../../core/interfaces/services/student/IStudentNotificationService';
import { IStudentNotificationRepository } from '../../core/interfaces/repositories/IStudentNotification';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import mongoose from 'mongoose';
import { INotification } from '../../models/Notification';

@injectable()
export class StudentNotificationService implements IStudentNotificationService {
  constructor(
    @inject(TYPES.StudentNotificationRepository)
    private readonly _notificationRepo: IStudentNotificationRepository
  ) {}

  async createNotification(userId: string, title: string, message: string, type: string): Promise<INotification> {
    if (!userId || !title || !message)
      throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);

    return this._notificationRepo.createNotification({
      userId: new mongoose.Types.ObjectId(userId),
      userRole: 'student',
      title,
      message,
      type,
    });
  }

  async getNotifications(userId: string): Promise<INotification[]> {
    return this._notificationRepo.getNotificationsByStudent(userId);
  }

  async markAsRead(notificationId: string): Promise<INotification> {
    const updated = await this._notificationRepo.markAsRead(notificationId);
    if (!updated) throwError(MESSAGES.NOTIFICATION_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return updated;
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    await this._notificationRepo.deleteNotification(notificationId);
    return true;
  }
}
