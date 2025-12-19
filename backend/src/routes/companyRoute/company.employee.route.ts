import express from 'express';
import container from '../../core/di/container';
import { CompanyEmployeeController } from '../../controllers/company/company.employee.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';

const router = express.Router();
const employeeController = container.get<CompanyEmployeeController>(TYPES.CompanyEmployeeController);

router.get('/', authMiddleware('company'), asyncHandler(employeeController.getAllEmployees.bind(employeeController)));
router.get('/:employeeId', authMiddleware('company'), asyncHandler(employeeController.getEmployeeById.bind(employeeController)));
router.patch('/block/:employeeId', authMiddleware('company'), asyncHandler(employeeController.blockEmployee.bind(employeeController)));
router.put('/:employeeId', authMiddleware('company'), asyncHandler(employeeController.updateEmployee.bind(employeeController)));
router.get('/requests/pending', authMiddleware('company'), asyncHandler(employeeController.getRequestedEmployees.bind(employeeController)));
router.patch('/approve/:employeeId', authMiddleware('company'), asyncHandler(employeeController.approveEmployee.bind(employeeController)));
router.patch('/reject/:employeeId', authMiddleware('company'), asyncHandler(employeeController.rejectEmployee.bind(employeeController)));
router.post('/invite', authMiddleware('company'), asyncHandler(employeeController.inviteEmployee.bind(employeeController)));
router.get('/search', authMiddleware('company'), asyncHandler(employeeController.searchEmployees.bind(employeeController)));
router.get('/:employeeId/progress', authMiddleware('company'), asyncHandler(employeeController.getEmployeeProgress.bind(employeeController)));
router.delete('/:employeeId', authMiddleware('company'), asyncHandler(employeeController.removeEmployee.bind(employeeController)));


export default router;
