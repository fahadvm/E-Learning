import { Router } from 'express';
import container from '../../core/di/container';
import { TeacherEnrollmentController } from '../../controllers/teacher/teacher.entrollment.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';

const router = Router();
const teacherEnrollmentController = container.get<TeacherEnrollmentController>(TYPES.TeacherEnrollmentController);

import { authMiddleware } from '../../middleware/authMiddleware';

router.get('/', authMiddleware('teacher'), asyncHandler(teacherEnrollmentController.getEnrollments.bind(teacherEnrollmentController)));

export default router;
