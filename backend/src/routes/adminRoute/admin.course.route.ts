import { Router } from 'express';
import container from '../../core/di/container';
import { AdminCourseController } from '../../controllers/admin/admin.course.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import {TYPES} from '../../core/di/types';

const courseRouter = Router();
const adminCourseCtrl = container.get<AdminCourseController>(TYPES.AdminCourseController);

courseRouter.get('/', asyncHandler(adminCourseCtrl.getAllCourses.bind(adminCourseCtrl)));
courseRouter.get('/unverified', asyncHandler(adminCourseCtrl.getUnverifiedCourses.bind(adminCourseCtrl)));
courseRouter.get('/:courseId', asyncHandler(adminCourseCtrl.getCourseById.bind(adminCourseCtrl)));
courseRouter.patch('/:courseId/verify', asyncHandler(adminCourseCtrl.verifyCourse.bind(adminCourseCtrl)));
courseRouter.patch('/:courseId/reject', asyncHandler(adminCourseCtrl.rejectCourse.bind(adminCourseCtrl)));
courseRouter.patch('/:courseId/block', asyncHandler(adminCourseCtrl.blockCourse.bind(adminCourseCtrl)));
courseRouter.patch('/:courseId/unblock', asyncHandler(adminCourseCtrl.unblockCourse.bind(adminCourseCtrl)));

export default courseRouter;
