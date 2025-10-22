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
const studentAuthCtrl = container_1.default.get(types_1.TYPES.StudentAuthController);
// Authentication
authRouter.post('/login', (0, asyncHandler_1.asyncHandler)(studentAuthCtrl.login.bind(studentAuthCtrl)));
authRouter.post('/signup', (0, asyncHandler_1.asyncHandler)(studentAuthCtrl.signup.bind(studentAuthCtrl)));
authRouter.post('/verify-otp', (0, asyncHandler_1.asyncHandler)(studentAuthCtrl.verifyOtp.bind(studentAuthCtrl)));
authRouter.post('/logout', (0, asyncHandler_1.asyncHandler)(studentAuthCtrl.logout.bind(studentAuthCtrl)));
// Google Auth
authRouter.post('/google/signup', (0, asyncHandler_1.asyncHandler)(studentAuthCtrl.googleAuth.bind(studentAuthCtrl)));
authRouter.post('/google/signup', (0, asyncHandler_1.asyncHandler)(studentAuthCtrl.googleAuth.bind(studentAuthCtrl)));
// Password Reset Flow
authRouter.post('/forgot-password', (0, asyncHandler_1.asyncHandler)(studentAuthCtrl.sendForgotPasswordOtp.bind(studentAuthCtrl)));
authRouter.post('/verify-forgot-otp', (0, asyncHandler_1.asyncHandler)(studentAuthCtrl.verifyForgotOtp.bind(studentAuthCtrl)));
authRouter.put('/set-new-password', (0, asyncHandler_1.asyncHandler)(studentAuthCtrl.setNewPassword.bind(studentAuthCtrl)));
authRouter.post('/resend-otp', (0, asyncHandler_1.asyncHandler)(studentAuthCtrl.resendOtp.bind(studentAuthCtrl)));
exports.default = authRouter;
