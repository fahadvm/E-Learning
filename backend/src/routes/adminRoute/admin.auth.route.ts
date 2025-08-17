import { Router } from 'express';
import container from '../../core/DI/container';
import { AdminAuthController } from '../../controllers/admin/admin.auth.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import {TYPES} from '../../core/DI/types';


const authRouter = Router();
const adminAuthCtrl = container.get<AdminAuthController>(TYPES.AdminAuthController);

authRouter.post('/login' ,asyncHandler(adminAuthCtrl.login.bind(adminAuthCtrl)));
authRouter.post('/logout',asyncHandler( adminAuthCtrl.logout.bind(adminAuthCtrl)));

export default authRouter;
