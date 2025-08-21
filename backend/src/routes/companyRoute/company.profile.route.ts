import express from 'express';
import container from '../../core/di/container';
import { CompanyProfileController } from '../../controllers/company/company.profile.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';


const router = express.Router();
const companyProfileController = container.get<CompanyProfileController>(TYPES.CompanyProfileController);
router.get('/', asyncHandler(companyProfileController.getProfile.bind(companyProfileController)));

export default router;
