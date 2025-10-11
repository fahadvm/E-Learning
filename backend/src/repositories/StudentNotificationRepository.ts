import { injectable } from "inversify";
import { Notification, INotification } from "../models/Notification";
import { IStudentNotificationRepository } from "../core/interfaces/repositories/IStudentNotification";
import { Types } from "mongoose";

@injectable()
export class StudentNotificationRepository implements IStudentNotificationRepository {
  async createNotification(data: Partial<INotification>): Promise<INotification> {
    const notification = new Notification(data);
    return await notification.save();
  }

  async getNotificationsByStudent(studentId: string): Promise<INotification[]> {
    return await Notification.find({ userId: new Types.ObjectId(studentId), userRole: "student" })
      .sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await Notification.findByIdAndDelete(notificationId);
  }
}
