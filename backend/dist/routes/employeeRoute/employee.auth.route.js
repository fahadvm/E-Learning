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
const employeeAuthCtrl = container_1.default.get(types_1.TYPES.EmployeeAuthController);
// Authentication
authRouter.post('/login', (0, asyncHandler_1.asyncHandler)(employeeAuthCtrl.login.bind(employeeAuthCtrl)));
authRouter.post('/signup', (0, asyncHandler_1.asyncHandler)(employeeAuthCtrl.signup.bind(employeeAuthCtrl)));
authRouter.post('/verify-otp', (0, asyncHandler_1.asyncHandler)(employeeAuthCtrl.verifyOtp.bind(employeeAuthCtrl)));
authRouter.post('/logout', (0, asyncHandler_1.asyncHandler)(employeeAuthCtrl.logout.bind(employeeAuthCtrl)));
authRouter.post('/google/signup', (0, asyncHandler_1.asyncHandler)(employeeAuthCtrl.googleAuth.bind(employeeAuthCtrl)));
// Password Reset Flow
authRouter.post('/forgot-password', (0, asyncHandler_1.asyncHandler)(employeeAuthCtrl.sendForgotPasswordOtp.bind(employeeAuthCtrl)));
authRouter.post('/verify-forgot-otp', (0, asyncHandler_1.asyncHandler)(employeeAuthCtrl.verifyForgotOtp.bind(employeeAuthCtrl)));
authRouter.put('/set-new-password', (0, asyncHandler_1.asyncHandler)(employeeAuthCtrl.setNewPassword.bind(employeeAuthCtrl)));
authRouter.post('/resend-otp', (0, asyncHandler_1.asyncHandler)(employeeAuthCtrl.resendOtp.bind(employeeAuthCtrl)));
exports.default = authRouter;
