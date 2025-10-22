import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { StudentNotificationController } from '../../controllers/student/student.notification.controller';

const router = Router();
const notifCtrl = container.get<StudentNotificationController>(TYPES.StudentNotificationController);

router.get('/', authMiddleware('student'), asyncHandler(notifCtrl.getNotifications.bind(notifCtrl)));
router.patch('/:id/read', authMiddleware('student'), asyncHandler(notifCtrl.markAsRead.bind(notifCtrl)));
router.delete('/:id', authMiddleware('student'), asyncHandler(notifCtrl.deleteNotification.bind(notifCtrl)));

export default router;
