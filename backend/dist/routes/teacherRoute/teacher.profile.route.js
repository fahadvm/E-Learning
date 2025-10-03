"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const teacherProfileController = container_1.default.get(types_1.TYPES.TeacherProfileController);
// Profile Routes
router
    .route('/')
    .get((0, authMiddleware_1.authMiddleware)('Teacher'), (0, asyncHandler_1.asyncHandler)(teacherProfileController.getProfile.bind(teacherProfileController)))
    .post((0, authMiddleware_1.authMiddleware)('Teacher'), (0, asyncHandler_1.asyncHandler)(teacherProfileController.createProfile.bind(teacherProfileController)))
    .patch((0, authMiddleware_1.authMiddleware)('Teacher'), (0, asyncHandler_1.asyncHandler)(teacherProfileController.updateProfile.bind(teacherProfileController)));
exports.default = router;
