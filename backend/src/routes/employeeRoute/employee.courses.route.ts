import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { EmployeeCourseController } from '../../controllers/employee/employee.course.controller';
import { EmployeeCommentController } from '../../controllers/employee/employee.comment.controller';

const courseRouter = Router();
const employeeCourseCtrl = container.get<EmployeeCourseController>(TYPES.EmployeeCourseController);
const employeeCommentCtrl = container.get<EmployeeCommentController>(TYPES.EmployeeCommentController);

courseRouter.get(
  '/enrolled',
  authMiddleware('employee'),
  asyncHandler(employeeCourseCtrl.myCourses.bind(employeeCourseCtrl))
);

courseRouter.get(
  '/enrolled/:courseId',
  authMiddleware('employee'),
  asyncHandler(employeeCourseCtrl.myCourseDetails.bind(employeeCourseCtrl))
);
courseRouter.post('/compiler/run', authMiddleware('employee'), asyncHandler(employeeCourseCtrl.codecompiler.bind(employeeCourseCtrl)));
courseRouter.post('/notes', authMiddleware('employee'), asyncHandler(employeeCourseCtrl.noteSaving.bind(employeeCourseCtrl)));
courseRouter.get('/:courseId/lesson/:lessonIndex/complete', authMiddleware('employee'), asyncHandler(employeeCourseCtrl.markLessonComplete.bind(employeeCourseCtrl)));
courseRouter.get('/resources/:courseId', authMiddleware('employee'), asyncHandler(employeeCourseCtrl.getCourseResources.bind(employeeCourseCtrl)));


courseRouter.route('/comment/:courseId')
  .get(authMiddleware('employee'), asyncHandler(employeeCommentCtrl.getComments.bind(employeeCommentCtrl)))
  .post(authMiddleware('employee'), asyncHandler(employeeCommentCtrl.addComment.bind(employeeCommentCtrl)));
courseRouter.delete('/comment/:commentId', authMiddleware('employee'), asyncHandler(employeeCommentCtrl.deleteComment.bind(employeeCommentCtrl)));


export default courseRouter;
