// src/services/teacher/TeacherNotificationService.ts
import { inject, injectable } from 'inversify';
import { INotificationService } from '../../core/interfaces/services/shared/INotificationService';
import { INotificationRepository } from '../../core/interfaces/repositories/INotificationRepository';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { INotification } from '../../models/Notification';
import { emitToUser } from '../../config/socket';

import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private readonly _notificationRepository: INotificationRepository,
    @inject(TYPES.EmployeeRepository)
    private readonly _employeeRepository: IEmployeeRepository
  ) { }


  async getUserNotifications(userId: string): Promise<INotification[]> {
    if (!userId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const notifications = await this._notificationRepository.findByUserId(userId);

    return notifications;
  }


  async markAsRead(notificationId: string): Promise<INotification> {
    if (!notificationId) throwError(MESSAGES.NOTIFICATION_ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const updatedNotification = await this._notificationRepository.markAsRead(notificationId);
    if (!updatedNotification) {
      throwError(MESSAGES.NOTIFICATION_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    return updatedNotification;
  }

  async createNotification(userId: string, title: string, message: string, type: string, userRole: string, link?: string): Promise<void> {
    await this._notificationRepository.createNotification(userId, title, message, type, userRole, link);

    // Emit notification via Socket
    emitToUser(userId, 'receive_notification', {
      title,
      message,
      type,
      link,
      userRole,
      createdAt: new Date()
    });
  }

  async checkInactivityNotifications(days: number): Promise<void> {
    const inactiveEmployees = await this._employeeRepository.findInactiveEmployees(days);

    // Group by company
    const groupedByCompany: Record<string, typeof inactiveEmployees> = {};
    inactiveEmployees.forEach(emp => {
      if (emp.companyId) {
        const cid = emp.companyId.toString();
        if (!groupedByCompany[cid]) groupedByCompany[cid] = [];
        groupedByCompany[cid].push(emp);
      }
    });

    for (const [companyId, employees] of Object.entries(groupedByCompany)) {
      const names = employees.map(e => e.name || e.email).join(', ');
      const message = employees.length > 3
        ? `${employees.length} employees have been inactive for over ${days} days.`
        : `The following employees have been inactive for over ${days} days: ${names}.`;

      await this.createNotification(
        companyId,
        'Employee Inactivity Alert',
        message,
        'inactivity',
        'company',
        '/company/employees'
      );
    }
  }
}
