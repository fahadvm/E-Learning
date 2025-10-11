import { Router } from 'express';
import container from '../../core/di/container';
import { TeacherCourseController } from '../../controllers/teacher/teacher.course.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { authMiddleware } from '../../middleware/authMiddleware';
import multer from 'multer';
import { TYPES } from '../../core/di/types';


const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();
const teacherCourseController = container.get<TeacherCourseController>(TYPES.TeacherCourseController);

// Course Routes

router
    .route('/')
    .get(authMiddleware('teacher'), asyncHandler(teacherCourseController.getMyCourses.bind(teacherCourseController)))
    .post(authMiddleware('teacher'), upload.any(), asyncHandler(teacherCourseController.addCourse.bind(teacherCourseController)));
router.route('/:courseId')
    .get(authMiddleware('teacher'), asyncHandler(teacherCourseController.getCourseById.bind(teacherCourseController)))
    .patch(authMiddleware('teacher'), asyncHandler(teacherCourseController.getCourseById.bind(teacherCourseController)));

export default router;
