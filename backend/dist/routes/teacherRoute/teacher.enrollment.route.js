"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const teacherEnrollmentController = container_1.default.get(types_1.TYPES.TeacherEnrollmentController);
const authMiddleware_1 = require("../../middleware/authMiddleware");
router.get('/', (0, authMiddleware_1.authMiddleware)('teacher'), (0, asyncHandler_1.asyncHandler)(teacherEnrollmentController.getEnrollments.bind(teacherEnrollmentController)));
exports.default = router;
