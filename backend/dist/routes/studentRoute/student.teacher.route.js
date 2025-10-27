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
const studentTeachercntrl = container_1.default.get(types_1.TYPES.StudentTeacherController);
router.get('/:teacherId', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentTeachercntrl.getProfile.bind(studentTeachercntrl)));
router.get('/availability/:teacherId', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentTeachercntrl.getAvailability.bind(studentTeachercntrl)));
exports.default = router;
