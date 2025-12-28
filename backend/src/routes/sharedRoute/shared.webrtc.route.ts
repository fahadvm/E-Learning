import express from 'express';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { SharedController } from '../../controllers/shared/shared.controller';
import { asyncHandler } from '../../middleware/asyncHandler';

const router = express.Router();

const sharedController = container.get<SharedController>(TYPES.SharedController);

router.get('/ice-config', asyncHandler(sharedController.getIceConfig.bind(sharedController)));

export default router;
