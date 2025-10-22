import { INotification } from '../../../../models/Notification';

export interface INotificationService {
  getUserNotifications(userId: string): Promise<INotification[]>;
  markAsRead(notificationId: string): Promise<INotification>;
}
