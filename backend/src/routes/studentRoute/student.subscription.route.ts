import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { StudentSubscriptionController } from '../../controllers/student/student.subscription.controller';
import { TYPES } from '../../core/di/types';

const router = Router();
const studentSubscriptionCtrl = container.get<StudentSubscriptionController>(TYPES.StudentSubscriptionController);

router.get('/', authMiddleware('student'), asyncHandler(studentSubscriptionCtrl.getAllStudentPlans.bind(studentSubscriptionCtrl)));
router.post('/create-order', authMiddleware('student'),  asyncHandler(studentSubscriptionCtrl.createOrder.bind(studentSubscriptionCtrl)));
router.post('/verify-payment', authMiddleware('student'),  asyncHandler(studentSubscriptionCtrl.verifyPayment.bind(studentSubscriptionCtrl)));
router.post('/activate-free', authMiddleware('student'),  asyncHandler(studentSubscriptionCtrl.activateFreePlan.bind(studentSubscriptionCtrl)));
router.get('/active', authMiddleware('student'),  asyncHandler(studentSubscriptionCtrl.getActiveSubscription.bind(studentSubscriptionCtrl)));
export default router;
