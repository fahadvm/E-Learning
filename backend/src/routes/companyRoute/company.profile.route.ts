import express from 'express';
import container from '../../core/di/container';
import { CompanyProfileController } from '../../controllers/company/company.profile.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { authMiddleware } from '../../middleware/authMiddleware';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const companyProfileController = container.get<CompanyProfileController>(TYPES.CompanyProfileController);

router.get('/', authMiddleware('company'), asyncHandler(companyProfileController.getProfile.bind(companyProfileController)));

router.post('/verify', authMiddleware('company'), upload.fields([
    { name: "certificate", maxCount: 1 },
    { name: "taxId", maxCount: 1 }
]), asyncHandler(companyProfileController.verify.bind(companyProfileController)));

router.put('/', authMiddleware('company'), asyncHandler(companyProfileController.updateProfile.bind(companyProfileController)));

// Email Change Routes
router.post('/change-email/send-otp', authMiddleware('company'), asyncHandler(companyProfileController.sendEmailChangeOTP.bind(companyProfileController)));
router.post('/change-email/verify-otp', authMiddleware('company'), asyncHandler(companyProfileController.verifyEmailChangeOTP.bind(companyProfileController)));

// Password Change Route
router.post('/change-password', authMiddleware('company'), asyncHandler(companyProfileController.changePassword.bind(companyProfileController)));

export default router;
