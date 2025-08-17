import { Router } from 'express';
import container from '../../core/DI/container';
import { authMiddleware } from '../../middleware/authMiddleware';import { asyncHandler } from '../../middleware/asyncHandler';
import { StudentSubscriptionController } from '../../controllers/student/student.subscription.controller';
import { TYPES } from '../../core/DI/types';

const router = Router();
const studentSubscriptionCtrl = container.get<StudentSubscriptionController>(TYPES.StudentSubscriptionController);

router.get('/', authMiddleware('student'), asyncHandler(studentSubscriptionCtrl.getAllStudentPlans.bind(studentSubscriptionCtrl)));

export default router;
