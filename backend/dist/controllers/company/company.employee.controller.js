"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyEmployeeController = void 0;
const inversify_1 = require("inversify");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResANDError_1 = require("../../utils/ResANDError");
const types_1 = require("../../core/di/types");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
let CompanyEmployeeController = class CompanyEmployeeController {
    constructor(_employeeService) {
        this._employeeService = _employeeService;
    }
    getAllEmployees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page = '1', limit = '10', search = '', sortBy = 'name', sortOrder = 'desc', department, position } = req.query;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const employees = yield this._employeeService.getAllEmployees(companyId, Number(page), Number(limit), String(search), String(sortBy), String(sortOrder), department ? String(department) : undefined, position ? String(position) : undefined);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.EMPLOYEES_FETCHED, true, employees);
        });
    }
    getEmployeeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employeeId } = req.params;
            if (!employeeId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const employee = yield this._employeeService.getEmployeeById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.EMPLOYEE_DETAILS_FETCHED, true, employee);
        });
    }
    blockEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employeeId } = req.params;
            const { status } = req.body;
            const employee = yield this._employeeService.blockEmployee(employeeId, status);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, status ? ResponseMessages_1.MESSAGES.EMPLOYEE_BLOCKED : ResponseMessages_1.MESSAGES.EMPLOYEE_UNBLOCKED, true, employee);
        });
    }
    updateEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeId = req.params.employeeId;
            if (!employeeId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const { name, email, position } = req.body;
            const updatedEmployee = yield this._employeeService.updateEmployee(employeeId, { name, email, position });
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.EMPLOYEE_UPDATED, true, updatedEmployee);
        });
    }
    getRequestedEmployees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const employees = yield this._employeeService.requestedEmployees(companyId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.REQUESTED_EMPLOYEES_FETCHED, true, employees);
        });
    }
    approveEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const employeeId = req.params.employeeId;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const employees = yield this._employeeService.approvingEmployee(companyId, employeeId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.EMPLOYEE_REQUEST_APPROVED, true, employees);
        });
    }
    rejectEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeId = req.params.employeeId;
            const { reason } = req.body;
            if (!employeeId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            if (!reason)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REJECTION_REASON_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const employee = yield this._employeeService.rejectingEmployee(employeeId, reason);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.EMPLOYEE_REQUEST_REJECTED, true, employee);
        });
    }
    inviteEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { email } = req.body;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            if (!email)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const employee = yield this._employeeService.inviteEmployee(companyId, email);
            if (employee) {
                (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.INVITATION_SENT, true, employee);
            }
            else {
                (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.INVITE_LINK_CREATED, true, { email });
            }
        });
    }
    searchEmployees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = req.query;
            if (!query)
                (0, ResANDError_1.throwError)('Search query is required', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const employees = yield this._employeeService.searchEmployees(String(query));
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, 'Employees found', true, employees);
        });
    }
    removeEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { employeeId } = req.params;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            if (!employeeId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._employeeService.removeEmployee(companyId, employeeId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, 'Employee removed from company', true, null);
        });
    }
    getEmployeeProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employeeId } = req.params;
            if (!employeeId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const progress = yield this._employeeService.getEmployeeProgress(employeeId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, 'Employee progress fetched', true, progress);
        });
    }
};
exports.CompanyEmployeeController = CompanyEmployeeController;
exports.CompanyEmployeeController = CompanyEmployeeController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyEmployeeService)),
    __metadata("design:paramtypes", [Object])
], CompanyEmployeeController);
