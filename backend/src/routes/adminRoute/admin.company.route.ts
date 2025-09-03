import { Router   } from 'express';
import container from '../../core/di/container';
import { AdminCompanyController } from '../../controllers/admin/admin.company.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types'; 

const companyRouter = Router();
const adminCompanyCtrl = container.get<AdminCompanyController>(TYPES.AdminCompanyController);

companyRouter.get('/', asyncHandler(adminCompanyCtrl.getAllCompanies.bind(adminCompanyCtrl)));
companyRouter.get('/unverified', asyncHandler(adminCompanyCtrl.getUnverifiedCompanies.bind(adminCompanyCtrl)));
companyRouter.get('/:companyId', asyncHandler(adminCompanyCtrl.getCompayById.bind(adminCompanyCtrl)));
companyRouter.get ('/employee/:employeeId', asyncHandler(adminCompanyCtrl.getEmployeeById.bind(adminCompanyCtrl)));
companyRouter.patch('/:companyId/verify', asyncHandler(adminCompanyCtrl.verifyCompany.bind(adminCompanyCtrl)));
companyRouter.patch('/:companyId/reject', asyncHandler(adminCompanyCtrl.rejectCompany.bind(adminCompanyCtrl)));
companyRouter.patch('/:companyId/block', asyncHandler(adminCompanyCtrl.blockCompany.bind(adminCompanyCtrl)));
companyRouter.patch('/:companyId/unblock', asyncHandler(adminCompanyCtrl.unblockCompany.bind(adminCompanyCtrl)));
companyRouter.put('/approve-all', asyncHandler(adminCompanyCtrl.approveAllCompanies.bind(adminCompanyCtrl)));
companyRouter.put('/reject-all', asyncHandler(adminCompanyCtrl.rejectAllCompanies.bind(adminCompanyCtrl)));

export default companyRouter;
