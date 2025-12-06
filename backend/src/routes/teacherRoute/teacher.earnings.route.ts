import { Router } from 'express';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { TeacherEarningsController } from '../../controllers/teacher/teacher.earnings.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';

const router = Router();
const teacherEarningsController = container.get<TeacherEarningsController>(TYPES.TeacherEarningsController);

router.get(
    '/',
    authMiddleware('teacher'),
    asyncHandler(teacherEarningsController.getEarningsHistory.bind(teacherEarningsController))
);

router.get(
    '/stats',
    authMiddleware('teacher'),
    asyncHandler(teacherEarningsController.getEarningsStats.bind(teacherEarningsController))
);

export default router;
