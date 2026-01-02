// src/routes/companyRoute/company.learningpath.route.ts
import express from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { CompanyLearningPathController } from '../../controllers/company/company.learningpath.controller';

const router = express.Router();
const controller = container.get<CompanyLearningPathController>(TYPES.CompanyLearningPathController);

router.post(
    '/',
    authMiddleware('company'),
    asyncHandler(controller.create.bind(controller))
);

router.get(
    '/',
    authMiddleware('company'),
    asyncHandler(controller.getAll.bind(controller))
);

router.get(
    '/:learningPathId',
    authMiddleware('company'),
    asyncHandler(controller.getOne.bind(controller))
);

router.put(
    '/:learningPathId',
    authMiddleware('company'),
    asyncHandler(controller.update.bind(controller))
);

router.delete(
    '/:learningPathId',
    authMiddleware('company'),
    asyncHandler(controller.delete.bind(controller))
);

router.get(
    '/assigned/:employeeId',
    authMiddleware('company'),
    asyncHandler(controller.listAssigned.bind(controller))
);

// Assign LP to employee
router.post(
    '/assign',
    authMiddleware('company'),
    asyncHandler(controller.assign.bind(controller))
);

// Unassign LP from employee
router.delete(
    '/unassign/employee',
    authMiddleware('company'),
    asyncHandler(controller.unassign.bind(controller))
);

export default router;
