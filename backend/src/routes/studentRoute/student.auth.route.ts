import { Router } from 'express';
import container from '../../core/DI/container';
import { asyncHandler } from '../../middleware/asyncHandler';
import { authMiddleware } from '../../middleware/authMiddleware';
import { TYPES } from '../../core/DI/types';
import { StudentAuthController } from '../../controllers/student/student.auth.controller';

const authRouter = Router();
const studentAuthCtrl = container.get<StudentAuthController>(TYPES.StudentAuthController);

// Authentication
authRouter.post('/login', asyncHandler(studentAuthCtrl.login.bind(studentAuthCtrl)));
authRouter.post('/signup', asyncHandler(studentAuthCtrl.signup.bind(studentAuthCtrl)));
authRouter.post('/verify-otp', asyncHandler(studentAuthCtrl.verifyOtp.bind(studentAuthCtrl)));
authRouter.post('/logout', authMiddleware('student'), asyncHandler(studentAuthCtrl.logout.bind(studentAuthCtrl)));

// Google Auth
authRouter.post('/google/signup', asyncHandler(studentAuthCtrl.googleAuth.bind(studentAuthCtrl)));

// Password Reset Flow
authRouter.post('/forgot-password', asyncHandler(studentAuthCtrl.sendForgotPasswordOtp.bind(studentAuthCtrl)));
authRouter.post('/verify-forgot-otp', asyncHandler(studentAuthCtrl.verifyForgotOtp.bind(studentAuthCtrl)));
authRouter.put('/set-new-password', asyncHandler(studentAuthCtrl.setNewPassword.bind(studentAuthCtrl)));
authRouter.post('/resend-otp', asyncHandler(studentAuthCtrl.resendOtp.bind(studentAuthCtrl)));

export default authRouter;
