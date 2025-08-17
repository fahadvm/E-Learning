import { Router } from 'express';
import container from '../../core/DI/container';
import { TeacherProfileController } from '../../controllers/teacher/teacher.profile.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { authMiddleware } from '../../middleware/authMiddleware';
import {TYPES} from '../../core/DI/types';

const router = Router();
const teacherProfileController = container.get<TeacherProfileController>(TYPES.TeacherProfileController);

// Profile Routes
router
  .route('/')
  .get(authMiddleware('Teacher'), asyncHandler(teacherProfileController.getProfile.bind(teacherProfileController)))
  .post(authMiddleware('Teacher'), asyncHandler(teacherProfileController.createProfile.bind(teacherProfileController)))
  .patch(authMiddleware('Teacher'), asyncHandler(teacherProfileController.updateProfile.bind(teacherProfileController)));

export default router;
