import express from 'express';
import container from '../../core/di/container';
import { CompanyProfileController } from '../../controllers/company/company.profile.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import multer from 'multer';


const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const companyProfileController = container.get<CompanyProfileController>(TYPES.CompanyProfileController);
router.get('/', asyncHandler(companyProfileController.getProfile.bind(companyProfileController)));
router.post('/verify', upload.fields([
    { name: "certificate", maxCount: 1 },
    { name: "taxId", maxCount: 1 }
]), asyncHandler(companyProfileController.verify.bind(companyProfileController)));
router.put('/', asyncHandler(companyProfileController.updateProfile.bind(companyProfileController))); // New route

export default router;
