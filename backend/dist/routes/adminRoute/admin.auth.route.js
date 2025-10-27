"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const authRouter = (0, express_1.Router)();
const adminAuthCtrl = container_1.default.get(types_1.TYPES.AdminAuthController);
authRouter.post('/login', (0, asyncHandler_1.asyncHandler)(adminAuthCtrl.login.bind(adminAuthCtrl)));
authRouter.post('/logout', (0, asyncHandler_1.asyncHandler)(adminAuthCtrl.logout.bind(adminAuthCtrl)));
exports.default = authRouter;
