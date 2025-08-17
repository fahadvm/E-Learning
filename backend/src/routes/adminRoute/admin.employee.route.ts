import { Router } from 'express';
import container from '../../core/DI/container';
import { AdminEmployeeController } from '../../controllers/admin/admin.employee.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/DI/types';

const employeeRouter = Router();
const adminEmployeeCtrl = container.get<AdminEmployeeController>(TYPES.AdminEmployeeController);

employeeRouter.get('/', asyncHandler(adminEmployeeCtrl.getEmployeesByCompany.bind(adminEmployeeCtrl)));
employeeRouter.get('/:employeeId', asyncHandler(adminEmployeeCtrl.getEmployeeById.bind(adminEmployeeCtrl)));
employeeRouter.patch('/:employeeId/block', asyncHandler(adminEmployeeCtrl.blockEmployee.bind(adminEmployeeCtrl)));
employeeRouter.patch('/:employeeId/unblock', asyncHandler(adminEmployeeCtrl.unblockEmployee.bind(adminEmployeeCtrl)));

export default employeeRouter;
