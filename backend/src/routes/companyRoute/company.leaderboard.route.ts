import express from 'express';
import container from '../../core/di/container';
import { CompanyEmployeeController } from '../../controllers/company/company.employee.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';
import { CompanyLeaderboardController } from '../../controllers/company/company.leaderboard.controller';

const router = express.Router();
const companyLeaderboardController = container.get<CompanyLeaderboardController>(TYPES.CompanyLeaderboardController);


router.get(
    "/",
    authMiddleware("company"),
    asyncHandler(companyLeaderboardController.getLeaderboard.bind(companyLeaderboardController)))
router.get(
    "/search",
    authMiddleware("company"),
    asyncHandler(companyLeaderboardController.search.bind(companyLeaderboardController)))

export default router;
