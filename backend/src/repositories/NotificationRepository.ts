import { INotification, Notification } from '../models/Notification';
import { INotificationRepository } from '../core/interfaces/repositories/INotificationRepository';
import { emitToUser } from '../config/socket';

export class NotificationRepository implements INotificationRepository {
  async createNotification(userId: string, title: string, message: string, type: string, userRole: string, link?: string) {
    const notification = await Notification.create({ userId, title, message, type, userRole, link });

    // Emit real-time notification to the user
    emitToUser(userId, 'receive_notification', {
      title,
      message,
      type,
      link,
      id: notification._id.toString(),
      createdAt: notification.createdAt
    });

    return notification;
  }
  async findByUserId(userId: string): Promise<INotification[]> {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  }
}
