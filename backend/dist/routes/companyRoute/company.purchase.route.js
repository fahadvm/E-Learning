"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const companyPurchaseCtrl = container_1.default.get(types_1.TYPES.CompanyPurchaseController);
const companyCourseController = container_1.default.get(types_1.TYPES.CompanyCourseController);
router.post("/checkout-session", (0, authMiddleware_1.authMiddleware)("company"), (0, asyncHandler_1.asyncHandler)(companyPurchaseCtrl.createCheckoutSession.bind(companyPurchaseCtrl)));
router.post("/verify-payment", (0, authMiddleware_1.authMiddleware)("company"), (0, asyncHandler_1.asyncHandler)(companyPurchaseCtrl.verifyPayment.bind(companyPurchaseCtrl)));
router.get('/entrollments', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(companyCourseController.getMyCourses.bind(companyCourseController)));
router.get('/entrollments/:courseId', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(companyCourseController.getMyCourseDetails.bind(companyCourseController)));
exports.default = router;
