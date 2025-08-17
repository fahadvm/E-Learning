import { Router } from 'express';
import container from '../../core/DI/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/DI/types';
import { StudentProfileController } from '../../controllers/student/student.profile.controller';

const profileRouter = Router();
const studentProfileCtrl = container.get<StudentProfileController>(TYPES.StudentProfileController);

profileRouter.route('/')
.get( authMiddleware('student'), asyncHandler(studentProfileCtrl.getProfile.bind(studentProfileCtrl)))
.patch( authMiddleware('student'), asyncHandler(studentProfileCtrl.editProfile.bind(studentProfileCtrl)));

export default profileRouter;
