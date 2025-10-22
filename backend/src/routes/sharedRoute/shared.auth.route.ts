

import { Router } from 'express';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { SharedController } from '../../controllers/shared/shared.controller';

const router = Router();
const sharedController = container.get<SharedController>(TYPES.SharedController);

router.get('/refresh-token',sharedController.refreshToken.bind(sharedController));

export default router;




