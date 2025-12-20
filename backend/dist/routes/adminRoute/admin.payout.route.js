"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const payoutController = container_1.default.get(types_1.TYPES.AdminPayoutController);
router.use((0, authMiddleware_1.authMiddleware)('admin'));
router.get('/', (0, asyncHandler_1.asyncHandler)(payoutController.getAllPayouts.bind(payoutController)));
router.patch('/approve/:payoutId', (0, asyncHandler_1.asyncHandler)(payoutController.approvePayout.bind(payoutController)));
router.patch('/reject/:payoutId', (0, asyncHandler_1.asyncHandler)(payoutController.rejectPayout.bind(payoutController)));
exports.default = router;
