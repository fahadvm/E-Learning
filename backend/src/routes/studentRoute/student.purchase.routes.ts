// routes/student/payment.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { StudentPurchaseController } from '../../controllers/student/student.purchase.controller';

const router = Router();
const StudentPurchaseCtrl = container.get<StudentPurchaseController>(TYPES.StudentPurchaseController);

router.post('/create-order', authMiddleware('student'), asyncHandler(StudentPurchaseCtrl.createOrder.bind(StudentPurchaseCtrl)));
router.post('/verify-payment', authMiddleware('student'), asyncHandler(StudentPurchaseCtrl.verifyPayment.bind(StudentPurchaseCtrl)));
router.get('/enrolled',  authMiddleware('student'), asyncHandler(StudentPurchaseCtrl.getMyCourses.bind(StudentPurchaseCtrl)));
router.get('/enrolled/:courseId',  authMiddleware('student'), asyncHandler(StudentPurchaseCtrl.getMyCourseDetails.bind(StudentPurchaseCtrl)));
export default router;
