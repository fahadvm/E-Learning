import { Router } from 'express';
import container from '../../core/di/container';
import { TeacherPayoutController } from '../../controllers/teacher/teacher.payout.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';

const router = Router();
const payoutController = container.get<TeacherPayoutController>(TYPES.TeacherPayoutController);

router.use(authMiddleware('teacher'));

router.get('/stats', asyncHandler(payoutController.getWalletStats.bind(payoutController)));
router.get('/history', asyncHandler(payoutController.getPayoutHistory.bind(payoutController)));
router.post('/withdraw', asyncHandler(payoutController.requestPayout.bind(payoutController)));

export default router;
