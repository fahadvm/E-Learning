import { Router } from 'express';
import container from '../../core/di/container';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { EmployeeProfileController } from '../../controllers/employee/employee.profile.controller';

const profileRouter = Router();
const employeeProfileCtrl = container.get<EmployeeProfileController>(TYPES.EmployeeProfileController);

profileRouter.route('/')
.get( authMiddleware('employee'), asyncHandler(employeeProfileCtrl.getProfile.bind(employeeProfileCtrl)))
.patch( authMiddleware('employee'), asyncHandler(employeeProfileCtrl.editProfile.bind(employeeProfileCtrl)));

export default profileRouter;
