import { Router } from 'express';
import container from '../../core/di/container';
import { TeacherCourseController } from '../../controllers/teacher/teacher.course.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { authMiddleware } from '../../middleware/authMiddleware';
import multer from 'multer';
import { TYPES } from '../../core/di/types';
import { EmployeeCourseReviewController } from '../../controllers/employee/employee.courseReview.controller';


const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();
const teacherCourseController = container.get<TeacherCourseController>(TYPES.TeacherCourseController);
const employeeCourseReviewCtrl = container.get<EmployeeCourseReviewController>(TYPES.EmployeeCourseReviewController);

// Course Routes

router
    .route('/')
    .get(authMiddleware('teacher'), asyncHandler(teacherCourseController.getMyCourses.bind(teacherCourseController)))
    .post(authMiddleware('teacher'), upload.any(), asyncHandler(teacherCourseController.addCourse.bind(teacherCourseController)));
router.route('/:courseId')
    .get(authMiddleware('teacher'), asyncHandler(teacherCourseController.getCourseById.bind(teacherCourseController)))
    .patch(authMiddleware('teacher'), asyncHandler(teacherCourseController.getCourseById.bind(teacherCourseController)));
router.route('/:courseId/resources')
    .get(authMiddleware('teacher'), asyncHandler(teacherCourseController.getResources.bind(teacherCourseController)))
    .post(authMiddleware('teacher'), upload.single('file'), asyncHandler(teacherCourseController.uploadResource.bind(teacherCourseController)));


router.delete('/:resourceId/resources', authMiddleware('teacher'), asyncHandler(teacherCourseController.deleteResource.bind(teacherCourseController)));


router.put(
    '/:courseId',
    authMiddleware('teacher'),
    upload.any(),
    asyncHandler(teacherCourseController.editCourse.bind(teacherCourseController))
);

router.get('/:courseId/analytics', authMiddleware('teacher'), asyncHandler(teacherCourseController.getCourseAnalytics.bind(teacherCourseController)));

router.get(
    '/:courseId/reviews',
    authMiddleware('teacher'),
    asyncHandler(employeeCourseReviewCtrl.getReviews.bind(employeeCourseReviewCtrl))
);

export default router;
