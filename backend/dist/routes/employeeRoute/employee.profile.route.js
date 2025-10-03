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
const profileRouter = (0, express_1.Router)();
const employeeProfileCtrl = container_1.default.get(types_1.TYPES.EmployeeProfileController);
profileRouter.route('/')
    .get((0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeProfileCtrl.getProfile.bind(employeeProfileCtrl)))
    .patch((0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeProfileCtrl.editProfile.bind(employeeProfileCtrl)));
exports.default = profileRouter;
