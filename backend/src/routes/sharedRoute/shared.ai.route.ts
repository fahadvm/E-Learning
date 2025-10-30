
import { Router } from 'express';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { AiTutorController } from '../../controllers/shared/ai.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
const router = Router();
const controller = container.get<AiTutorController>(TYPES.AiTutorController);

router.post('/message/:courseId',asyncHandler(controller.askQuestion.bind(controller)));

export default router;

