import express from 'express';
import container from '../../core/di/container';
import { CompanyCourseController } from '../../controllers/company/company.course.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';


const router = express.Router();
const companyCourseController = container.get<CompanyCourseController>(TYPES.CompanyCourseController);

router.get('/', authMiddleware('company'), asyncHandler(companyCourseController.getAllCourses.bind(companyCourseController)));
router.get('/:courseId', authMiddleware('company'), asyncHandler(companyCourseController.getCourseDetailById.bind(companyCourseController)));
router.post('/assign-course', authMiddleware('company'), asyncHandler(companyCourseController.assignCourseToEmployee.bind(companyCourseController)));


export default router;
