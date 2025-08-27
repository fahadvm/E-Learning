import express from 'express';
import container from '../../core/di/container';
import { CompanyEmployeeController } from '../../controllers/company/company.employee.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';

const router = express.Router();
const employeeController = container.get<CompanyEmployeeController>(TYPES.CompanyEmployeeController);

router.post('/', authMiddleware('company'), asyncHandler(employeeController.addEmployee.bind(employeeController)));
router.get('/', authMiddleware('company'), asyncHandler(employeeController.getAllEmployees.bind(employeeController)));
router.get('/:employeeId', authMiddleware('company'), asyncHandler(employeeController.getEmployeeById.bind(employeeController)));
router.patch('/block/:employeeId', authMiddleware('company'), asyncHandler(employeeController.blockEmployee.bind(employeeController)));
router.put('/:employeeId', authMiddleware('company'), asyncHandler(employeeController.updateEmployee.bind(employeeController)));


export default router;
