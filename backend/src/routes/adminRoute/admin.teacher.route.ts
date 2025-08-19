import { Router } from 'express';
import container from '../../core/di/container';
import { AdminTeacherController } from '../../controllers/admin/admin.teacher.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import {TYPES} from '../../core/di/types';

const teacherRouter = Router();
const adminTeacherCtrl = container.get<AdminTeacherController>(TYPES.AdminTeacherController);

teacherRouter.get('/', asyncHandler(adminTeacherCtrl.getAllTeachers.bind(adminTeacherCtrl)));
teacherRouter.get('/unverified', asyncHandler(adminTeacherCtrl.getUnverifiedTeachers.bind(adminTeacherCtrl)));
teacherRouter.patch('/:teacherId/verify', asyncHandler(adminTeacherCtrl.verifyTeacher.bind(adminTeacherCtrl)));
teacherRouter.patch('/:teacherId/reject', asyncHandler(adminTeacherCtrl.rejectTeacher.bind(adminTeacherCtrl)));
teacherRouter.patch('/:teacherId/block', asyncHandler(adminTeacherCtrl.blockTeacher.bind(adminTeacherCtrl)));
teacherRouter.patch('/:teacherId/unblock', asyncHandler(adminTeacherCtrl.unblockTeacher.bind(adminTeacherCtrl)));

export default teacherRouter;
