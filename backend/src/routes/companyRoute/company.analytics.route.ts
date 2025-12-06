import express from 'express';
import container from '../../core/di/container';
import { CompanyAnalyticsController } from '../../controllers/company/company.analytics.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();
const analyticsController = container.get<CompanyAnalyticsController>(TYPES.CompanyAnalyticsController);

router.get('/tracker', authMiddleware('company'), asyncHandler(analyticsController.getTrackerStats.bind(analyticsController)));

export default router;
