"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const courseRouter = (0, express_1.Router)();
const adminCourseCtrl = container_1.default.get(types_1.TYPES.AdminCourseController);
courseRouter.get('/', (0, asyncHandler_1.asyncHandler)(adminCourseCtrl.getAllCourses.bind(adminCourseCtrl)));
courseRouter.get('/unverified', (0, asyncHandler_1.asyncHandler)(adminCourseCtrl.getUnverifiedCourses.bind(adminCourseCtrl)));
courseRouter.get('/:courseId', (0, asyncHandler_1.asyncHandler)(adminCourseCtrl.getCourseById.bind(adminCourseCtrl)));
courseRouter.patch('/verify/:courseId', (0, asyncHandler_1.asyncHandler)(adminCourseCtrl.verifyCourse.bind(adminCourseCtrl)));
courseRouter.patch('/reject/:courseId', (0, asyncHandler_1.asyncHandler)(adminCourseCtrl.rejectCourse.bind(adminCourseCtrl)));
courseRouter.patch('/block/:courseId', (0, asyncHandler_1.asyncHandler)(adminCourseCtrl.blockCourse.bind(adminCourseCtrl)));
courseRouter.patch('/unblock/:courseId', (0, asyncHandler_1.asyncHandler)(adminCourseCtrl.unblockCourse.bind(adminCourseCtrl)));
exports.default = courseRouter;
