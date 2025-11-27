import { Router } from 'express';
import container from '../../core/di/container';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { StudentAuthController } from '../../controllers/student/student.auth.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const authRouter = Router();
const studentAuthCtrl = container.get<StudentAuthController>(TYPES.StudentAuthController);

// Authentication
authRouter.post('/login', asyncHandler(studentAuthCtrl.login.bind(studentAuthCtrl)));
authRouter.post('/signup', asyncHandler(studentAuthCtrl.signup.bind(studentAuthCtrl)));
authRouter.post('/verify-otp', asyncHandler(studentAuthCtrl.verifyOtp.bind(studentAuthCtrl)));
authRouter.post('/logout', asyncHandler(studentAuthCtrl.logout.bind(studentAuthCtrl)));

// Google Auth
authRouter.post('/google/signup', asyncHandler(studentAuthCtrl.googleAuth.bind(studentAuthCtrl)));

// Password Reset Flow
authRouter.post('/forgot-password', asyncHandler(studentAuthCtrl.sendForgotPasswordOtp.bind(studentAuthCtrl)));
authRouter.post('/verify-forgot-otp', asyncHandler(studentAuthCtrl.verifyForgotOtp.bind(studentAuthCtrl)));
authRouter.put('/set-new-password', asyncHandler(studentAuthCtrl.setNewPassword.bind(studentAuthCtrl)));
authRouter.post('/resend-otp', asyncHandler(studentAuthCtrl.resendOtp.bind(studentAuthCtrl)));



authRouter.put('/change-password',authMiddleware('student'), asyncHandler(studentAuthCtrl.changePassword.bind(studentAuthCtrl)));
authRouter.post('/change-email/send-otp',authMiddleware('student'), asyncHandler(studentAuthCtrl.sendEmailChangeOtp.bind(studentAuthCtrl)));
authRouter.post('/change-email/verify-otp',authMiddleware('student'), asyncHandler(studentAuthCtrl.verifyAndUpdateEmail.bind(studentAuthCtrl)));



export default authRouter;
