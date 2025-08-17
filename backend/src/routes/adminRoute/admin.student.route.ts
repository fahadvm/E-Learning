import { Router } from 'express';
import container from '../../core/DI/container';
import { AdminStudentController } from '../../controllers/admin/admin.student.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/DI/types';

const studentRouter = Router();
const adminStudentCtrl = container.get<AdminStudentController>(TYPES.AdminStudentController);

studentRouter.get('/', asyncHandler(adminStudentCtrl.getAllStudents.bind(adminStudentCtrl)));
studentRouter.get('/:studentId', asyncHandler(adminStudentCtrl.getStudentById.bind(adminStudentCtrl)));
studentRouter.patch('/:studentId/block', asyncHandler(adminStudentCtrl.blockStudent.bind(adminStudentCtrl)));
studentRouter.patch('/:studentId/unblock', asyncHandler(adminStudentCtrl.unblockStudent.bind(adminStudentCtrl)));

export default studentRouter;
