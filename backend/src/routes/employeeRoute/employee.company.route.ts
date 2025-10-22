// src/routes/employee/employee.company.route.ts
import { Router } from 'express';
import container from '../../core/di/container';
import { asyncHandler } from '../../middleware/asyncHandler';
import { authMiddleware } from '../../middleware/authMiddleware';
import { EmployeeCompanyController } from '../../controllers/employee/employee.company.controller';
import { TYPES } from '../../core/di/types';

const router = Router();
const employeeCompanyCtrl = container.get<EmployeeCompanyController>(
  TYPES.EmployeeCompanyController
);

router.get(
  '/',
  authMiddleware('employee'),
  asyncHandler(employeeCompanyCtrl.getCompany.bind(employeeCompanyCtrl))
);
router.get(
  '/requestedCompany',
  authMiddleware('employee'),
  asyncHandler(employeeCompanyCtrl.requestedCompany.bind(employeeCompanyCtrl))
);

router.post(
  '/findcompany',
  authMiddleware('employee'),
  asyncHandler(employeeCompanyCtrl.findCompany.bind(employeeCompanyCtrl))
);

router.post(
  '/sendrequest',
  authMiddleware('employee'),
  asyncHandler(employeeCompanyCtrl.sendRequest.bind(employeeCompanyCtrl))
);

router.post(
  '/cancelrequest',
  authMiddleware('employee'),
  asyncHandler(employeeCompanyCtrl.cancelRequest.bind(employeeCompanyCtrl))
);

router.post(
  '/leavecompany',
  authMiddleware('employee'),
  asyncHandler(employeeCompanyCtrl.leaveCompany.bind(employeeCompanyCtrl))
);

export default router;
