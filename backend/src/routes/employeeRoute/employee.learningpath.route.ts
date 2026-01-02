import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { EmployeeLearningPathController } from '../../controllers/employee/employee.learningpath.controller';
const router = Router();
const controller = container.get<EmployeeLearningPathController>(TYPES.EmployeeLearningPathController);

// GET all assigned LPs
router.get('/', authMiddleware('employee'), asyncHandler(controller.getAssignedPaths.bind(controller)));

// GET detail of one LP
router.get('/:learningPathId', authMiddleware('employee'), asyncHandler(controller.getLearningPathDetail.bind(controller)));

// Mark course completed → update progress
router.post('/progress/update', authMiddleware('employee'), asyncHandler(controller.updateProgress.bind(controller)));

// Pause / Resume LP
router.patch('/status', authMiddleware('employee'), asyncHandler(controller.updateStatus.bind(controller)));

export default router;
