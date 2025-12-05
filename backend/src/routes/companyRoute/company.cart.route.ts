// routes/company/cart.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { CompanyCartController } from '../../controllers/company/company.cart.controller';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';

const router = Router();
const CompanyCartCtrl = container.get<CompanyCartController>(TYPES.CompanyCartController);

router.get('/', authMiddleware('company'), asyncHandler(CompanyCartCtrl.getCart.bind(CompanyCartCtrl)));
router.post('/', authMiddleware('company'), asyncHandler(CompanyCartCtrl.addToCart.bind(CompanyCartCtrl)));
router.delete('/:courseId', authMiddleware('company'), asyncHandler(CompanyCartCtrl.removeFromCart.bind(CompanyCartCtrl)));
router.delete('/', authMiddleware('company'), asyncHandler(CompanyCartCtrl.clearCart.bind(CompanyCartCtrl)));
router.patch(
    '/seat/:courseId',
    authMiddleware('company'),
    asyncHandler(CompanyCartCtrl.updateSeat.bind(CompanyCartCtrl))
);

export default router;
