import { Router } from 'express';
import container from '../../core/di/container';
import { TeacherAuthController } from '../../controllers/teacher/teacher.auth.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import {TYPES} from '../../core/di/types';



const router = Router();
const teacherAuthController = container.get<TeacherAuthController>(TYPES.TeacherAuthController);


router.post('/signup', asyncHandler(teacherAuthController.signup.bind(teacherAuthController)));
router.post('/login', asyncHandler(teacherAuthController.login.bind(teacherAuthController)));
router.post('/logout', asyncHandler(teacherAuthController.logout.bind(teacherAuthController)));
router.post('/verify-otp', asyncHandler(teacherAuthController.verifyOtp.bind(teacherAuthController)));
router.post('/resend-otp', asyncHandler(teacherAuthController.resendOtp.bind(teacherAuthController)));
router.post('/forgot-password', asyncHandler(teacherAuthController.sendForgotPasswordOtp.bind(teacherAuthController)));
router.post('/verify-forgot-otp', asyncHandler(teacherAuthController.verifyForgotOtp.bind(teacherAuthController)));
router.post('/reset-password', asyncHandler(teacherAuthController.setNewPassword.bind(teacherAuthController)));

export default router;
