import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { AdminProfileController } from '../../controllers/admin/admin.profile.controller';
import { TYPES } from '../../core/di/types';

const router = Router();
const adminProfileCtrl = container.get<AdminProfileController>(TYPES.AdminProfileController);

router.get('/', authMiddleware('admin'), asyncHandler(adminProfileCtrl.getProfile.bind(adminProfileCtrl)));
router.put('/', authMiddleware('admin'), asyncHandler(adminProfileCtrl.updateProfile.bind(adminProfileCtrl)));
router.post('/change-password', authMiddleware('admin'), asyncHandler(adminProfileCtrl.changePassword.bind(adminProfileCtrl)));
router.post('/request-email-change', authMiddleware('admin'), asyncHandler(adminProfileCtrl.requestEmailChange.bind(adminProfileCtrl)));
router.post('/verify-email-change', authMiddleware('admin'), asyncHandler(adminProfileCtrl.verifyEmailChangeOtp.bind(adminProfileCtrl)));
router.post('/add-admin', authMiddleware('admin'), asyncHandler(adminProfileCtrl.addNewAdmin.bind(adminProfileCtrl)));

export default router;
