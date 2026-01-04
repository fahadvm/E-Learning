import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { EmployeeTeacherReviewController } from '../../controllers/employee/employee.teacherReview.controller';
import { EmployeeTeacherController } from '../../controllers/employee/employee.teacher.controller';

const router = Router();
const employeeTeacherReviewCtrl = container.get<EmployeeTeacherReviewController>(TYPES.EmployeeTeacherReviewController);
const employeeTeacherCtrl = container.get<EmployeeTeacherController>(TYPES.EmployeeTeacherController);

router.get(
    '/:teacherId',
    authMiddleware('employee'),
    asyncHandler(employeeTeacherCtrl.getProfile.bind(employeeTeacherCtrl))
);

router.post(
    '/review/add',
    authMiddleware('employee'),
    asyncHandler(employeeTeacherReviewCtrl.addReview.bind(employeeTeacherReviewCtrl))
);

router.put(
    '/review/:reviewId',
    authMiddleware('employee'),
    asyncHandler(employeeTeacherReviewCtrl.updateReview.bind(employeeTeacherReviewCtrl))
);

router.delete(
    '/review/:reviewId',
    authMiddleware('employee'),
    asyncHandler(employeeTeacherReviewCtrl.deleteReview.bind(employeeTeacherReviewCtrl))
);

router.get(
    '/reviews/:teacherId',
    authMiddleware('employee'),
    asyncHandler(employeeTeacherReviewCtrl.getTeacherReviews.bind(employeeTeacherReviewCtrl))
);

router.get(
    '/teacher/:teacherId/stats',
    authMiddleware('employee'),
    asyncHandler(employeeTeacherReviewCtrl.getRatingStats.bind(employeeTeacherReviewCtrl))
);

export default router;
