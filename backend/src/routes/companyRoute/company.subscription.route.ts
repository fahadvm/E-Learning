import express from 'express';
import container from '../../core/di/container';
import { CompanySubscriptionController } from '../../controllers/company/company.subscription.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { TYPES } from '../../core/di/types';

const router = express.Router();
const companySubscriptionController = container.get<CompanySubscriptionController>(TYPES.CompanySubscriptionController);


router.get('/', authMiddleware('company'), companySubscriptionController.getAllCompanyPlans.bind(companySubscriptionController));

export default router;
