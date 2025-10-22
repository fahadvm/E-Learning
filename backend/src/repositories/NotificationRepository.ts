import  { INotification , Notification } from '../models/Notification';
import { INotificationRepository } from '../core/interfaces/repositories/INotificationRepository';

export class NotificationRepository  implements INotificationRepository {
 async createNotification(userId: string, title: string, message: string, type: string , userRole : string) {
    await Notification.create({ userId, title, message, type , userRole  });
  }
  async findByUserId(userId: string) : Promise<INotification[] >{
    return await Notification.find({ userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string): Promise<INotification | null>{
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  }
}
