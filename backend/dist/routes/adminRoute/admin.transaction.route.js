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
const transactionAdminRoute = (0, express_1.Router)();
const transactionAdminController = container_1.default.get(types_1.TYPES.TransactionAdminController);
transactionAdminRoute.get("/", (0, authMiddleware_1.authMiddleware)('admin'), (0, asyncHandler_1.asyncHandler)(transactionAdminController.getTransactions.bind(transactionAdminController)));
exports.default = transactionAdminRoute;
