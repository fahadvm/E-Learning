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
router.post('/compiler/run', authMiddleware('student'), asyncHandler(studentCourseCtrl.codecompiler.bind(studentCourseCtrl)));
router.post('/notes', authMiddleware('student'), asyncHandler(studentCourseCtrl.noteSaving.bind(studentCourseCtrl)));
router.get( '/:courseId/lesson/:lessonIndex/complete', authMiddleware('student'), asyncHandler(studentCourseCtrl.markLessonComplete.bind(studentCourseCtrl)));
router.get( '/resources/:courseId', authMiddleware('student'), asyncHandler(studentCourseCtrl.getCourseResources.bind(studentCourseCtrl)));




export default router;
