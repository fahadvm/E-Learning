"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const teacherRouter = (0, express_1.Router)();
const adminTeacherCtrl = container_1.default.get(types_1.TYPES.AdminTeacherController);
teacherRouter.get('/', (0, asyncHandler_1.asyncHandler)(adminTeacherCtrl.getAllTeachers.bind(adminTeacherCtrl)));
teacherRouter.get('/unverified', (0, asyncHandler_1.asyncHandler)(adminTeacherCtrl.getVerificationRequests.bind(adminTeacherCtrl)));
teacherRouter.get('/:teacherId', (0, asyncHandler_1.asyncHandler)(adminTeacherCtrl.getTeacherById.bind(adminTeacherCtrl)));
teacherRouter.patch('/verify/:teacherId', (0, asyncHandler_1.asyncHandler)(adminTeacherCtrl.verifyTeacher.bind(adminTeacherCtrl)));
teacherRouter.patch('/reject/:teacherId', (0, asyncHandler_1.asyncHandler)(adminTeacherCtrl.rejectTeacher.bind(adminTeacherCtrl)));
teacherRouter.patch('/block/:teacherId', (0, asyncHandler_1.asyncHandler)(adminTeacherCtrl.blockTeacher.bind(adminTeacherCtrl)));
teacherRouter.patch('/unblock/:teacherId', (0, asyncHandler_1.asyncHandler)(adminTeacherCtrl.unblockTeacher.bind(adminTeacherCtrl)));
exports.default = teacherRouter;
