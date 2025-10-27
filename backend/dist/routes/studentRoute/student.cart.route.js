"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/student/cart.routes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
types_1.TYPES;
const router = (0, express_1.Router)();
const StudentCartCtrl = container_1.default.get(types_1.TYPES.StudentCartController);
router.get('/', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(StudentCartCtrl.getCart.bind(StudentCartCtrl)));
router.post('/', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(StudentCartCtrl.addToCart.bind(StudentCartCtrl)));
router.delete('/:courseId', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(StudentCartCtrl.removeFromCart.bind(StudentCartCtrl)));
router.delete('/', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(StudentCartCtrl.clearCart.bind(StudentCartCtrl)));
exports.default = router;
