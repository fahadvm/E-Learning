import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { StudentCourseController } from '../../controllers/student/student.course.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { StudentCommentController } from '../../controllers/student/student.comment.controller';


const router = Router();
const studentCourseCtrl = container.get<StudentCourseController>(TYPES.StudentCourseController);
const studentCommentCtrl = container.get<StudentCommentController>(TYPES.StudentCommentController);

router.get('/', authMiddleware('student'), asyncHandler(studentCourseCtrl.getAllCourses.bind(studentCourseCtrl)));
router.get('/:courseId', authMiddleware('student'), asyncHandler(studentCourseCtrl.getCourseDetailById.bind(studentCourseCtrl)));
router.post('/compiler/run', authMiddleware('student'), asyncHandler(studentCourseCtrl.codecompiler.bind(studentCourseCtrl)));
router.post('/notes', authMiddleware('student'), asyncHandler(studentCourseCtrl.noteSaving.bind(studentCourseCtrl)));
router.get( '/:courseId/lesson/:lessonIndex/complete', authMiddleware('student'), asyncHandler(studentCourseCtrl.markLessonComplete.bind(studentCourseCtrl)));
router.get( '/resources/:courseId', authMiddleware('student'), asyncHandler(studentCourseCtrl.getCourseResources.bind(studentCourseCtrl)));


router.route('/comment/:courseId')
.get(authMiddleware('student'), asyncHandler(studentCommentCtrl.getComments.bind(studentCourseCtrl)))
.post(authMiddleware('student'), asyncHandler(studentCommentCtrl.addComment.bind(studentCourseCtrl)));
router.delete('/comment/:commentId',authMiddleware('student'), asyncHandler(studentCommentCtrl.deleteComment.bind(studentCourseCtrl)));




export default router;
