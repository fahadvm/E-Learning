import { Router } from 'express';
import container from '../../core/di/container';
import { AdminPayoutController } from '../../controllers/admin/admin.payout.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';

const router = Router();
const payoutController = container.get<AdminPayoutController>(TYPES.AdminPayoutController);

router.use(authMiddleware('admin'));

router.get('/', asyncHandler(payoutController.getAllPayouts.bind(payoutController)));
router.patch('/approve/:payoutId', asyncHandler(payoutController.approvePayout.bind(payoutController)));
router.patch('/reject/:payoutId', asyncHandler(payoutController.rejectPayout.bind(payoutController)));

export default router;
