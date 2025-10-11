export interface IStudentNotificationService {
  createNotification(userId: string, title: string, message: string, type: string): Promise<any>;
  getNotifications(userId: string): Promise<any>;
  markAsRead(notificationId: string): Promise<any>;
  deleteNotification(notificationId: string): Promise<any>;
}
