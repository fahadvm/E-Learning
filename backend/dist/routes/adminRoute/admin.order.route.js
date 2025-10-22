"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin/adminOrder.routes.ts
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const router = (0, express_1.Router)();
const orderCtrl = container_1.default.get(types_1.TYPES.AdminOrderController);
router.get('/company', (0, asyncHandler_1.asyncHandler)(orderCtrl.getCompanyOrders.bind(orderCtrl)));
router.get('/student', (0, asyncHandler_1.asyncHandler)(orderCtrl.getStudentOrders.bind(orderCtrl)));
exports.default = router;
