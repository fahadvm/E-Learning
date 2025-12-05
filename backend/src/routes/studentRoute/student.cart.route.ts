// routes/student/cart.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { StudentCartController } from '../../controllers/student/student.cart.controller';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
TYPES;
const router = Router();
const StudentCartCtrl = container.get<StudentCartController>(TYPES.StudentCartController);

router.get('/', authMiddleware('student'), asyncHandler(StudentCartCtrl.getCart.bind(StudentCartCtrl)));
router.post('/', authMiddleware('student'), asyncHandler(StudentCartCtrl.addToCart.bind(StudentCartCtrl)));
router.delete('/:courseId', authMiddleware('student'), asyncHandler(StudentCartCtrl.removeFromCart.bind(StudentCartCtrl)));
router.delete('/', authMiddleware('student'), asyncHandler(StudentCartCtrl.clearCart.bind(StudentCartCtrl)));


export default router;
