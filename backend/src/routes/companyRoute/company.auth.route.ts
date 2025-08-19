import express from 'express';
import container from '../../core/di/container';
import { CompanyAuthController } from '../../controllers/company/company.auth.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import {TYPES} from '../../core/di/types';

const router = express.Router();
const companyAuthController = container.get<CompanyAuthController>(TYPES.CompanyAuthController);

router.post('/signup', asyncHandler(companyAuthController.sendOtp.bind(companyAuthController)));
router.post('/verify-otp', asyncHandler(companyAuthController.verifyOtp.bind(companyAuthController)));
router.post('/login', asyncHandler(companyAuthController.login.bind(companyAuthController)));
router.post('/logout', asyncHandler(companyAuthController.logout.bind(companyAuthController)));

router.post('/forgot-password', asyncHandler(companyAuthController.forgotPassword.bind(companyAuthController)));
router.post('/reset-password', asyncHandler(companyAuthController.resetPassword.bind(companyAuthController)));
router.post('/verify-forgot-otp', asyncHandler(companyAuthController.verifyForgotOtp.bind(companyAuthController)));
router.post('/resend-otp', asyncHandler(companyAuthController.resendOtp.bind(companyAuthController)));

export default router;
