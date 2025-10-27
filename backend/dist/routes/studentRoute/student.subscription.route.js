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
const studentSubscriptionCtrl = container_1.default.get(types_1.TYPES.StudentSubscriptionController);
router.get('/', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentSubscriptionCtrl.getAllStudentPlans.bind(studentSubscriptionCtrl)));
router.post('/create-order', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentSubscriptionCtrl.createOrder.bind(studentSubscriptionCtrl)));
router.post('/verify-payment', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentSubscriptionCtrl.verifyPayment.bind(studentSubscriptionCtrl)));
router.post('/activate-free', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentSubscriptionCtrl.activateFreePlan.bind(studentSubscriptionCtrl)));
router.get('/active', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentSubscriptionCtrl.getActiveSubscription.bind(studentSubscriptionCtrl)));
exports.default = router;
