"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const router = (0, express_1.Router)();
const teacherEarningsController = container_1.default.get(types_1.TYPES.TeacherEarningsController);
router.get('/', (0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(teacherEarningsController.getEarningsHistory.bind(teacherEarningsController)));
router.get('/stats', (0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(teacherEarningsController.getEarningsStats.bind(teacherEarningsController)));
exports.default = router;
