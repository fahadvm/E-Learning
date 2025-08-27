import { Router } from 'express';
import container from '../../core/di/container';
import { AdminTeacherController } from '../../controllers/admin/admin.teacher.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';

const teacherRouter = Router();
const adminTeacherCtrl = container.get<AdminTeacherController>(TYPES.AdminTeacherController);

teacherRouter.get('/', asyncHandler(adminTeacherCtrl.getAllTeachers.bind(adminTeacherCtrl)));
teacherRouter.get('/unverified', asyncHandler(adminTeacherCtrl.getUnverifiedTeachers.bind(adminTeacherCtrl)));
teacherRouter.get('/:teacherId', asyncHandler(adminTeacherCtrl.getTeacherById.bind(adminTeacherCtrl)));
teacherRouter.get('/courses/:teacherId', asyncHandler(adminTeacherCtrl.getTeacherCourses.bind(adminTeacherCtrl))); // new for courses
teacherRouter.patch('/verify/:teacherId', asyncHandler(adminTeacherCtrl.verifyTeacher.bind(adminTeacherCtrl)));
teacherRouter.patch('/reject/:teacherId', asyncHandler(adminTeacherCtrl.rejectTeacher.bind(adminTeacherCtrl)));
teacherRouter.patch('/block/:teacherId', asyncHandler(adminTeacherCtrl.blockTeacher.bind(adminTeacherCtrl)));
teacherRouter.patch('/unblock/:teacherId', asyncHandler(adminTeacherCtrl.unblockTeacher.bind(adminTeacherCtrl)));

export default teacherRouter;
