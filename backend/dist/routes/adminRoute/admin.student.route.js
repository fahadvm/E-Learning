"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const studentRouter = (0, express_1.Router)();
const adminStudentCtrl = container_1.default.get(types_1.TYPES.AdminStudentController);
studentRouter.get('/', (0, asyncHandler_1.asyncHandler)(adminStudentCtrl.getAllStudents.bind(adminStudentCtrl)));
studentRouter.get('/:studentId', (0, asyncHandler_1.asyncHandler)(adminStudentCtrl.getStudentById.bind(adminStudentCtrl)));
studentRouter.patch('/:studentId/block', (0, asyncHandler_1.asyncHandler)(adminStudentCtrl.blockStudent.bind(adminStudentCtrl)));
studentRouter.patch('/:studentId/unblock', (0, asyncHandler_1.asyncHandler)(adminStudentCtrl.unblockStudent.bind(adminStudentCtrl)));
exports.default = studentRouter;
