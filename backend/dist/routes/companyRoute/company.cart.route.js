"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/company/cart.routes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const CompanyCartCtrl = container_1.default.get(types_1.TYPES.CompanyCartController);
router.get('/', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(CompanyCartCtrl.getCart.bind(CompanyCartCtrl)));
router.post('/', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(CompanyCartCtrl.addToCart.bind(CompanyCartCtrl)));
router.delete('/:courseId', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(CompanyCartCtrl.removeFromCart.bind(CompanyCartCtrl)));
router.delete('/', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(CompanyCartCtrl.clearCart.bind(CompanyCartCtrl)));
router.patch('/seat/:courseId', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(CompanyCartCtrl.updateSeat.bind(CompanyCartCtrl)));
exports.default = router;
