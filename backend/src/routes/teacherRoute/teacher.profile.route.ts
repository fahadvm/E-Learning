import { Router } from 'express';
import container from '../../core/di/container';
import { TeacherProfileController } from '../../controllers/teacher/teacher.profile.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { authMiddleware } from '../../middleware/authMiddleware';
import { TYPES } from '../../core/di/types';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = Router();
const teacherProfileController = container.get<TeacherProfileController>(TYPES.TeacherProfileController);
// Profile Routes
router
  .route('/')
  .get(authMiddleware('teacher'), asyncHandler(teacherProfileController.getProfile.bind(teacherProfileController)))
  .post(authMiddleware('teacher'), asyncHandler(teacherProfileController.createProfile.bind(teacherProfileController)))
  .patch(authMiddleware('teacher'), asyncHandler(teacherProfileController.updateProfile.bind(teacherProfileController)));

router.post("/verify",upload.single("resume"),authMiddleware('teacher'), asyncHandler(teacherProfileController.sendVerificationRequest.bind(teacherProfileController)));

export default router;
