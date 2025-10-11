import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { StudentCourseController } from '../../controllers/student/student.course.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';


const router = Router();
const studentCourseCtrl = container.get<StudentCourseController>(TYPES.StudentCourseController);

router.get('/', authMiddleware('student'), asyncHandler(studentCourseCtrl.getAllCourses.bind(studentCourseCtrl)));
router.get('/:courseId', authMiddleware('student'), asyncHandler(studentCourseCtrl.getCourseDetailById.bind(studentCourseCtrl)));
router.get( '/:courseId/module/:moduleIndex/lesson/:lessonIndex/complete', authMiddleware('student'), asyncHandler(studentCourseCtrl.markLessonComplete.bind(studentCourseCtrl)));

export default router;
