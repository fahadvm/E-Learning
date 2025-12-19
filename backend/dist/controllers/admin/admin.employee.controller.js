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
exports.AdminEmployeeController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const validatePagination_1 = require("../../utils/validatePagination");
const socket_1 = require("../../config/socket");
let AdminEmployeeController = class AdminEmployeeController {
    constructor(_employeeService) {
        this._employeeService = _employeeService;
    }
    getEmployeesByCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyId } = req.params;
            const { page = '1', limit = '10', search = '' } = req.query;
            const { pageNum, limitNum, error } = (0, validatePagination_1.validatePagination)(String(page), String(limit));
            if (error || pageNum === null || limitNum === null) {
                return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST, error, false);
            }
            const result = yield this._employeeService.getEmployeesByCompany(companyId, pageNum, limitNum, String(search || ''));
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.EMPLOYEES_FETCHED, true, result);
        });
    }
    getAllEmployees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = '1', limit = '10', search = '', status } = req.query;
            const { pageNum, limitNum, error } = (0, validatePagination_1.validatePagination)(String(page), String(limit));
            if (error || pageNum === null || limitNum === null) {
                return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST, error, false);
            }
            const result = yield this._employeeService.getAllEmployees(pageNum, limitNum, String(search || ''), status ? String(status) : undefined);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.EMPLOYEES_FETCHED, true, result);
        });
    }
    getEmployeeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employeeId } = req.params;
            const employee = yield this._employeeService.getEmployeeById(employeeId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.EMPLOYEE_DETAILS_FETCHED, true, employee);
        });
    }
    blockEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employeeId } = req.params;
            const updatedEmployee = yield this._employeeService.blockEmployee(employeeId);
            // Real-time logout trigger
            (0, socket_1.emitToUser)(employeeId, 'accountBlocked', {
                message: 'Your employee account has been blocked by the admin. You will be logged out shortly.'
            });
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.EMPLOYEE_BLOCKED, true, updatedEmployee);
        });
    }
    unblockEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employeeId } = req.params;
            const updatedEmployee = yield this._employeeService.unblockEmployee(employeeId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.EMPLOYEE_UNBLOCKED, true, updatedEmployee);
        });
    }
};
exports.AdminEmployeeController = AdminEmployeeController;
exports.AdminEmployeeController = AdminEmployeeController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminEmployeeService)),
    __metadata("design:paramtypes", [Object])
], AdminEmployeeController);
