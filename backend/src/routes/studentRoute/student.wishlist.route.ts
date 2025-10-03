import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { StudentWishlistController } from '../../controllers/student/student.wishlist.controller';

const router = Router();
const studentWishlistCtrl = container.get<StudentWishlistController>(TYPES.StudentWishlistController);

router.post('/', authMiddleware('student'), asyncHandler(studentWishlistCtrl.add.bind(studentWishlistCtrl)));
router.get('/', authMiddleware('student'), asyncHandler(studentWishlistCtrl.list.bind(studentWishlistCtrl)));
router.delete('/:courseId', authMiddleware('student'), asyncHandler(studentWishlistCtrl.remove.bind(studentWishlistCtrl)));

export default router;
