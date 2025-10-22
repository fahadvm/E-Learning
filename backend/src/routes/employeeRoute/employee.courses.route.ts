import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { EmployeeCourseController } from '../../controllers/employee/employee.course.controller';

const courseRouter = Router();
const employeeCourseCtrl = container.get<EmployeeCourseController>(TYPES.EmployeeCourseController);

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

export default courseRouter;
