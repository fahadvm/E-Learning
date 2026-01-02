
import { Router } from 'express';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { AdminReportsController } from '../../controllers/admin/admin.reports.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';

const adminReportsRoute = Router();

const adminReportsController = container.get<AdminReportsController>(TYPES.AdminReportsController);

adminReportsRoute.get(
    '/dashboard',
    authMiddleware('admin'),
    asyncHandler(adminReportsController.getDashboardStats.bind(adminReportsController))
);

export default adminReportsRoute;
