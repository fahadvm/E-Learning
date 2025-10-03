import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { CompanyWishlistController } from '../../controllers/company/company.wishlist.controller';

const router = Router();
const companyWishlistCtrl = container.get<CompanyWishlistController>(TYPES.CompanyWishlistController);

router.post('/', authMiddleware('company'), asyncHandler(companyWishlistCtrl.add.bind(companyWishlistCtrl)));
router.get('/', authMiddleware('company'), asyncHandler(companyWishlistCtrl.list.bind(companyWishlistCtrl)));
router.delete('/:courseId', authMiddleware('company'), asyncHandler(companyWishlistCtrl.remove.bind(companyWishlistCtrl)));

export default router;
