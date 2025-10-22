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
const courseRouter = (0, express_1.Router)();
const employeeCourseCtrl = container_1.default.get(types_1.TYPES.EmployeeCourseController);
courseRouter.get('/enrolled', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseCtrl.myCourses.bind(employeeCourseCtrl)));
courseRouter.get('/enrolled/:courseId', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCourseCtrl.myCourseDetails.bind(employeeCourseCtrl)));
exports.default = courseRouter;
