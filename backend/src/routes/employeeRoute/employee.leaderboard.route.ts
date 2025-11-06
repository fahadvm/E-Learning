import { Router } from "express";
import container from "../../core/di/container";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authMiddleware } from "../../middleware/authMiddleware";
import { EmployeeLeaderboardController } from "../../controllers/employee/employee.leaderboard.controller";
import { TYPES } from "../../core/di/types";

const router = Router();
const leaderboardCtrl = container.get<EmployeeLeaderboardController>(TYPES.EmployeeLeaderboardController);

router.get("/all-time", authMiddleware("employee"), asyncHandler(leaderboardCtrl.allTime.bind(leaderboardCtrl)));
router.get("/weekly", authMiddleware("employee"), asyncHandler(leaderboardCtrl.weekly.bind(leaderboardCtrl)));
router.get("/monthly", authMiddleware("employee"), asyncHandler(leaderboardCtrl.monthly.bind(leaderboardCtrl)));

export default router;
