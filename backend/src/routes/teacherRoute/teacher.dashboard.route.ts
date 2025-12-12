import express from 'express';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { TeacherDashboardController } from '../../controllers/teacher/teacher.dashboard.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const dashboardRouter = express.Router();
const controller = container.get<TeacherDashboardController>(TYPES.TeacherDashboardController);

dashboardRouter.use(authMiddleware('teacher'));

import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../../types/AuthenticatedRequest';

dashboardRouter.get('/stats', (req: Request, res: Response, next: NextFunction) => {
    controller.getDashboardStats(req as AuthRequest, res).catch(next);
});

dashboardRouter.get('/top-courses', (req: Request, res: Response, next: NextFunction) => {
    controller.getTopCourses(req as AuthRequest, res).catch(next);
});

dashboardRouter.get('/earnings-graph', (req: Request, res: Response, next: NextFunction) => {
    controller.getEarningsGraph(req as AuthRequest, res).catch(next);
});

dashboardRouter.get('/schedule', (req: Request, res: Response, next: NextFunction) => {
    controller.getUpcomingSchedule(req as AuthRequest, res).catch(next);
});

export default dashboardRouter;
