import { Router } from 'express';
import container from '../../core/di/container';
import { AdminCourseController } from '../../controllers/admin/admin.course.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';

const courseRouter = Router();
const adminCourseCtrl = container.get<AdminCourseController>(TYPES.AdminCourseController);

courseRouter.get('/', asyncHandler(adminCourseCtrl.getAllCourses.bind(adminCourseCtrl)));
courseRouter.get('/unverified', asyncHandler(adminCourseCtrl.getUnverifiedCourses.bind(adminCourseCtrl)));
courseRouter.get('/:courseId', asyncHandler(adminCourseCtrl.getCourseById.bind(adminCourseCtrl)));
courseRouter.patch('/verify/:courseId', asyncHandler(adminCourseCtrl.verifyCourse.bind(adminCourseCtrl)));
courseRouter.patch('/reject/:courseId', asyncHandler(adminCourseCtrl.rejectCourse.bind(adminCourseCtrl)));
courseRouter.patch('/block/:courseId', asyncHandler(adminCourseCtrl.blockCourse.bind(adminCourseCtrl)));
courseRouter.patch('/unblock/:courseId', asyncHandler(adminCourseCtrl.unblockCourse.bind(adminCourseCtrl)));
courseRouter.get('/analytics/:courseId', asyncHandler(adminCourseCtrl.getCourseAnalytics.bind(adminCourseCtrl)));

export default courseRouter;

