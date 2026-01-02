"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const leaderboardCtrl = container_1.default.get(types_1.TYPES.EmployeeLeaderboardController);
router.get('/all-time', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(leaderboardCtrl.allTime.bind(leaderboardCtrl)));
router.get('/weekly', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(leaderboardCtrl.weekly.bind(leaderboardCtrl)));
router.get('/monthly', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(leaderboardCtrl.monthly.bind(leaderboardCtrl)));
exports.default = router;
