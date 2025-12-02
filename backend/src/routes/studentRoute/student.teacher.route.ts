import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { StudentTeacherController } from '../../controllers/student/student.teacher.controller';
import { StudentTeacherReviewController } from '../../controllers/student/student.teacherReview.controller';

const router = Router();
const studentTeachercntrl = container.get<StudentTeacherController>(TYPES.StudentTeacherController);
const studentTeacherReviewCtrl = container.get<StudentTeacherReviewController>(TYPES.StudentTeacherReviewController);

router.get('/:teacherId', authMiddleware('student'), asyncHandler(studentTeachercntrl.getProfile.bind(studentTeachercntrl)));
router.get('/availability/:teacherId', authMiddleware('student'), asyncHandler(studentTeachercntrl.getAvailability.bind(studentTeachercntrl)));

router.post(
  "/review/add",
  authMiddleware("student"),
  asyncHandler(studentTeacherReviewCtrl.addReview.bind(studentTeacherReviewCtrl))
);

router.put(
  "/review/:reviewId",
  authMiddleware("student"),
  asyncHandler(studentTeacherReviewCtrl.updateReview.bind(studentTeacherReviewCtrl))
);

router.delete(
  "/review/:reviewId",
  authMiddleware("student"),
  asyncHandler(studentTeacherReviewCtrl.deleteReview.bind(studentTeacherReviewCtrl))
);

router.get(
  "/reviews/:teacherId",
  authMiddleware('student'),
  asyncHandler(studentTeacherReviewCtrl.getTeacherReviews.bind(studentTeacherReviewCtrl))
);

router.get(
  "/teacher/:teacherId/stats",
  authMiddleware('student'),
  asyncHandler(studentTeacherReviewCtrl.getRatingStats.bind(studentTeacherReviewCtrl))
);

export default router;
