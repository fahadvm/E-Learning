"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/student/payment.routes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const StudentPurchaseCtrl = container_1.default.get(types_1.TYPES.StudentPurchaseController);
router.post("/create-order", (0, authMiddleware_1.authMiddleware)("student"), (0, asyncHandler_1.asyncHandler)(StudentPurchaseCtrl.createOrder.bind(StudentPurchaseCtrl)));
router.post("/verify-payment", (0, authMiddleware_1.authMiddleware)("student"), (0, asyncHandler_1.asyncHandler)(StudentPurchaseCtrl.verifyPayment.bind(StudentPurchaseCtrl)));
router.get("/enrolled", (0, authMiddleware_1.authMiddleware)("student"), (0, asyncHandler_1.asyncHandler)(StudentPurchaseCtrl.getMyCourses.bind(StudentPurchaseCtrl)));
router.get("/enrolled/:courseId", (0, authMiddleware_1.authMiddleware)("student"), (0, asyncHandler_1.asyncHandler)(StudentPurchaseCtrl.getMyCourseDetails.bind(StudentPurchaseCtrl)));
exports.default = router;
