import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { StudentTeacherController } from '../../controllers/student/student.teacher.controller';

const router = Router();
const studentTeachercntrl = container.get<StudentTeacherController>(TYPES.StudentTeacherController);

router.get('/:teacherId', authMiddleware('student'), asyncHandler(studentTeachercntrl.getProfile.bind(studentTeachercntrl)));
router.get('/availability/:teacherId', authMiddleware('student'), asyncHandler(studentTeachercntrl.getAvailability.bind(studentTeachercntrl)));


export default router;
