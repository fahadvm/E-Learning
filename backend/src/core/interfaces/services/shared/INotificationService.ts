import { INotification } from '../../../../models/Notification';

export interface INotificationService {
  getUserNotifications(userId: string): Promise<INotification[]>;
  markAsRead(notificationId: string): Promise<INotification>;
  createNotification(userId: string, title: string, message: string, type: string, userRole: string, link?: string): Promise<void>;
  checkInactivityNotifications(days: number): Promise<void>;
}
