"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const types_1 = require("../../core/di/types");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
const teacherCourseController = container_1.default.get(types_1.TYPES.TeacherCourseController);
// Course Routes
router
    .route('/')
    .get((0, authMiddleware_1.authMiddleware)('Teacher'), (0, asyncHandler_1.asyncHandler)(teacherCourseController.getMyCourses.bind(teacherCourseController)))
    .post((0, authMiddleware_1.authMiddleware)('Teacher'), upload.any(), (0, asyncHandler_1.asyncHandler)(teacherCourseController.addCourse.bind(teacherCourseController)));
router.route('/:courseId')
    .get((0, authMiddleware_1.authMiddleware)('Teacher'), (0, asyncHandler_1.asyncHandler)(teacherCourseController.getCourseById.bind(teacherCourseController)))
    .patch((0, authMiddleware_1.authMiddleware)('Teacher'), (0, asyncHandler_1.asyncHandler)(teacherCourseController.getCourseById.bind(teacherCourseController)));
exports.default = router;
