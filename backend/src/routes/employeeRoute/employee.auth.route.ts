import { Router } from 'express';
import container from '../../core/di/container';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { EmployeeAuthController } from '../../controllers/employee/employee.auth.controller';

const authRouter = Router();
const employeeAuthCtrl = container.get<EmployeeAuthController>(TYPES.EmployeeAuthController);

// Authentication
authRouter.post('/login', asyncHandler(employeeAuthCtrl.login.bind(employeeAuthCtrl)));
authRouter.post('/signup', asyncHandler(employeeAuthCtrl.signup.bind(employeeAuthCtrl)));
authRouter.post('/verify-otp', asyncHandler(employeeAuthCtrl.verifyOtp.bind(employeeAuthCtrl)));
authRouter.post('/logout', asyncHandler(employeeAuthCtrl.logout.bind(employeeAuthCtrl)));

authRouter.post('/google/signup', asyncHandler(employeeAuthCtrl.googleAuth.bind(employeeAuthCtrl)));

// Password Reset Flow
authRouter.post('/forgot-password', asyncHandler(employeeAuthCtrl.sendForgotPasswordOtp.bind(employeeAuthCtrl)));
authRouter.post('/verify-forgot-otp', asyncHandler(employeeAuthCtrl.verifyForgotOtp.bind(employeeAuthCtrl)));
authRouter.put('/set-new-password', asyncHandler(employeeAuthCtrl.setNewPassword.bind(employeeAuthCtrl)));
authRouter.post('/resend-otp', asyncHandler(employeeAuthCtrl.resendOtp.bind(employeeAuthCtrl)));

export default authRouter;
