import { INotification } from '../../../../models/Notification';

export interface IStudentNotificationService {
  createNotification(
    userId: string,
    title: string,
    message: string,
    type: string
  ): Promise<INotification>;

  getNotifications(userId: string): Promise<INotification[]>;

  markAsRead(notificationId: string): Promise<INotification>;

  deleteNotification(notificationId: string): Promise<boolean>;
}
