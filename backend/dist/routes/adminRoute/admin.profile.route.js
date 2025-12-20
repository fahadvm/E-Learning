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
const adminProfileCtrl = container_1.default.get(types_1.TYPES.AdminProfileController);
router.get('/', (0, authMiddleware_1.authMiddleware)('admin'), (0, asyncHandler_1.asyncHandler)(adminProfileCtrl.getProfile.bind(adminProfileCtrl)));
router.put('/', (0, authMiddleware_1.authMiddleware)('admin'), (0, asyncHandler_1.asyncHandler)(adminProfileCtrl.updateProfile.bind(adminProfileCtrl)));
router.post('/change-password', (0, authMiddleware_1.authMiddleware)('admin'), (0, asyncHandler_1.asyncHandler)(adminProfileCtrl.changePassword.bind(adminProfileCtrl)));
router.post('/request-email-change', (0, authMiddleware_1.authMiddleware)('admin'), (0, asyncHandler_1.asyncHandler)(adminProfileCtrl.requestEmailChange.bind(adminProfileCtrl)));
router.post('/verify-email-change', (0, authMiddleware_1.authMiddleware)('admin'), (0, asyncHandler_1.asyncHandler)(adminProfileCtrl.verifyEmailChangeOtp.bind(adminProfileCtrl)));
router.post('/add-admin', (0, authMiddleware_1.authMiddleware)('admin'), (0, asyncHandler_1.asyncHandler)(adminProfileCtrl.addNewAdmin.bind(adminProfileCtrl)));
exports.default = router;
