import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';import { asyncHandler } from '../../middleware/asyncHandler';
import { StudentSubscriptionController } from '../../controllers/student/student.subscription.controller';
import { TYPES } from '../../core/di/types';

const router = Router();
const studentSubscriptionCtrl = container.get<StudentSubscriptionController>(TYPES.StudentSubscriptionController);

router.get('/', authMiddleware('student'), asyncHandler(studentSubscriptionCtrl.getAllStudentPlans.bind(studentSubscriptionCtrl)));

export default router;
