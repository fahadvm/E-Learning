
import { INotification } from '../../../models/Notification';


export interface INotificationRepository {
  createNotification(userId: string, title: string, message: string, type: string, userRole: string, link?: string): Promise<void>

  findByUserId(userId: string): Promise<INotification[]>


  markAsRead(notificationId: string): Promise<INotification | null>
}
