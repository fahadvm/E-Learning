import { INotification } from '../../../models/Notification';

export interface IStudentNotificationRepository {
  createNotification(data: Partial<INotification>): Promise<INotification>;
  getNotificationsByStudent(studentId: string): Promise<INotification[]>;
  markAsRead(notificationId: string): Promise<INotification | null>;
  deleteNotification(notificationId: string): Promise<void>;
}
