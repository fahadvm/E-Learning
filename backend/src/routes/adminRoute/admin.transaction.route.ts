
import { Router } from 'express';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { TransactionAdminController } from '../../controllers/admin/transaction.admin.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';

const transactionAdminRoute = Router();

const transactionAdminController = container.get<TransactionAdminController>(TYPES.TransactionAdminController);

transactionAdminRoute.get(
    '/',
    authMiddleware('admin'),
    asyncHandler(transactionAdminController.getTransactions.bind(transactionAdminController))
);

export default transactionAdminRoute;
