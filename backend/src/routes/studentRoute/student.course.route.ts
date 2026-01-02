import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { StudentCourseController } from '../../controllers/student/student.course.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { StudentCommentController } from '../../controllers/student/student.comment.controller';
import { StudentCourseReviewController } from '../../controllers/student/student.courseReview.controller';
import { StudentCourseCertificateController } from '../../controllers/student/student.courseCertificate.controller';


const router = Router();
const studentCourseCtrl = container.get<StudentCourseController>(TYPES.StudentCourseController);
const studentCommentCtrl = container.get<StudentCommentController>(TYPES.StudentCommentController);
const studentCourseReviewCtrl = container.get<StudentCourseReviewController>(TYPES.StudentCourseReviewController);
const studentCourseCertCtrl = container.get<StudentCourseCertificateController>(TYPES.StudentCourseCertificateController);

router.get('/', authMiddleware('student'), asyncHandler(studentCourseCtrl.getAllCourses.bind(studentCourseCtrl)));
router.get('/:courseId', authMiddleware('student'), asyncHandler(studentCourseCtrl.getCourseDetailById.bind(studentCourseCtrl)));
router.post('/compiler/run', authMiddleware('student'), asyncHandler(studentCourseCtrl.codecompiler.bind(studentCourseCtrl)));
router.post('/notes', authMiddleware('student'), asyncHandler(studentCourseCtrl.noteSaving.bind(studentCourseCtrl)));
router.get('/:courseId/lesson/:lessonIndex/complete', authMiddleware('student'), asyncHandler(studentCourseCtrl.markLessonComplete.bind(studentCourseCtrl)));
router.get('/resources/:courseId', authMiddleware('student'), asyncHandler(studentCourseCtrl.getCourseResources.bind(studentCourseCtrl)));


router.route('/comment/:courseId')
    .get(authMiddleware('student'), asyncHandler(studentCommentCtrl.getComments.bind(studentCourseCtrl)))
    .post(authMiddleware('student'), asyncHandler(studentCommentCtrl.addComment.bind(studentCourseCtrl)));
router.delete('/comment/:commentId', authMiddleware('student'), asyncHandler(studentCommentCtrl.deleteComment.bind(studentCourseCtrl)));


router.post('/course-review', authMiddleware('student'), asyncHandler(studentCourseReviewCtrl.addReview.bind(studentCourseReviewCtrl)));
router.get('/course-reviews/:courseId', authMiddleware('student'), asyncHandler(studentCourseReviewCtrl.getReviews.bind(studentCourseReviewCtrl)));
router.delete('/course-review/:reviewId', authMiddleware('student'), asyncHandler(studentCourseReviewCtrl.deleteReview.bind(studentCourseReviewCtrl)));


router.get( '/my/certificates', authMiddleware('student'), asyncHandler(studentCourseCertCtrl.getMyCourseCertificates.bind(studentCourseCertCtrl)));
router.get( '/certificates/:courseId', authMiddleware('student'), asyncHandler(studentCourseCertCtrl.getCourseCertificate.bind(studentCourseCertCtrl)));
router.post( '/generate/certificate', authMiddleware('student'), asyncHandler(studentCourseCertCtrl.generateCourseCertificate.bind(studentCourseCertCtrl)));


export default router;
