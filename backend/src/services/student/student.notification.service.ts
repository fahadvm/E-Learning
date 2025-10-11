import { injectable, inject } from "inversify";
import { IStudentNotificationService } from "../../core/interfaces/services/student/IStudentNotificationService";
import { IStudentNotificationRepository } from "../../core/interfaces/repositories/IStudentNotification";
import { TYPES } from "../../core/di/types";
import { throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";
import mongoose from "mongoose";

@injectable()
export class StudentNotificationService implements IStudentNotificationService {
  constructor(
    @inject(TYPES.StudentNotificationRepository)
    private readonly _notificationRepo: IStudentNotificationRepository
  ) {}

  async createNotification(userId: string, title: string, message: string, type: string) {
    if (!userId || !title || !message)
      throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);

    return await this._notificationRepo.createNotification({
      userId : new mongoose.Types.ObjectId(userId),
      userRole: "student",
      title,
      message,
      type,
    });
  }

  async getNotifications(userId: string) {
    return await this._notificationRepo.getNotificationsByStudent(userId);
  }

  async markAsRead(notificationId: string) {
    const updated = await this._notificationRepo.markAsRead(notificationId);
    if (!updated) throwError(MESSAGES.NOTIFICATION_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return updated;
  }

  async deleteNotification(notificationId: string) {
    await this._notificationRepo.deleteNotification(notificationId);
    return true;
  }
}
