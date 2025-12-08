"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/employee/employee.company.route.ts
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const employeeCompanyCtrl = container_1.default.get(types_1.TYPES.EmployeeCompanyController);
router.get('/', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCompanyCtrl.getCompany.bind(employeeCompanyCtrl)));
router.get('/requestedCompany', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCompanyCtrl.requestedCompany.bind(employeeCompanyCtrl)));
router.post('/findcompany', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCompanyCtrl.findCompany.bind(employeeCompanyCtrl)));
router.post('/sendrequest', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCompanyCtrl.sendRequest.bind(employeeCompanyCtrl)));
router.get('/cancelRequest', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCompanyCtrl.cancelRequest.bind(employeeCompanyCtrl)));
router.post('/leavecompany', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCompanyCtrl.leaveCompany.bind(employeeCompanyCtrl)));
router.get('/invitation', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCompanyCtrl.getInvitation.bind(employeeCompanyCtrl)));
router.post('/accept-invite', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCompanyCtrl.acceptInvite.bind(employeeCompanyCtrl)));
router.post('/reject-invite', (0, authMiddleware_1.authMiddleware)('employee'), (0, asyncHandler_1.asyncHandler)(employeeCompanyCtrl.rejectInvite.bind(employeeCompanyCtrl)));
exports.default = router;
