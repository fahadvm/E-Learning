import { Router } from 'express';
import container from '../../core/di/container';
import { TeacherProfileController } from '../../controllers/teacher/teacher.profile.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { authMiddleware } from '../../middleware/authMiddleware';
import { TYPES } from '../../core/di/types';
import { EmployeeTeacherReviewController } from '../../controllers/employee/employee.teacherReview.controller';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = Router();
const teacherProfileController = container.get<TeacherProfileController>(TYPES.TeacherProfileController);
const employeeTeacherReviewCtrl = container.get<EmployeeTeacherReviewController>(TYPES.EmployeeTeacherReviewController);

// Profile Routes
router
  .route('/')
  .get(authMiddleware('teacher'), asyncHandler(teacherProfileController.getProfile.bind(teacherProfileController)))
  .post(authMiddleware('teacher'), asyncHandler(teacherProfileController.createProfile.bind(teacherProfileController)))
  .patch(authMiddleware('teacher'), asyncHandler(teacherProfileController.updateProfile.bind(teacherProfileController)));

router.post('/verify', upload.single('resume'), authMiddleware('teacher'), asyncHandler(teacherProfileController.sendVerificationRequest.bind(teacherProfileController)));
router.patch('/change-password', authMiddleware('teacher'), asyncHandler(teacherProfileController.changePassword.bind(teacherProfileController)));
router.post('/change-email-otp', authMiddleware('teacher'), asyncHandler(teacherProfileController.requestEmailChange.bind(teacherProfileController)));
router.post('/verify-change-email', authMiddleware('teacher'), asyncHandler(teacherProfileController.verifyEmailChangeOtp.bind(teacherProfileController)));

router.get(
  '/reviews/:teacherId',
  authMiddleware('teacher'),
  asyncHandler(employeeTeacherReviewCtrl.getTeacherReviews.bind(employeeTeacherReviewCtrl))
);

export default router;
