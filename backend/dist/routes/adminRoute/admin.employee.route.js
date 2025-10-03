"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const employeeRouter = (0, express_1.Router)();
const adminEmployeeCtrl = container_1.default.get(types_1.TYPES.AdminEmployeeController);
employeeRouter.get('/', (0, asyncHandler_1.asyncHandler)(adminEmployeeCtrl.getEmployeesByCompany.bind(adminEmployeeCtrl)));
employeeRouter.get('/:employeeId', (0, asyncHandler_1.asyncHandler)(adminEmployeeCtrl.getEmployeeById.bind(adminEmployeeCtrl)));
employeeRouter.patch('/:employeeId/block', (0, asyncHandler_1.asyncHandler)(adminEmployeeCtrl.blockEmployee.bind(adminEmployeeCtrl)));
employeeRouter.patch('/:employeeId/unblock', (0, asyncHandler_1.asyncHandler)(adminEmployeeCtrl.unblockEmployee.bind(adminEmployeeCtrl)));
exports.default = employeeRouter;
