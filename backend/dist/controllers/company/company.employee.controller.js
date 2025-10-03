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
    addEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyId, name, email, coursesAssigned, position } = req.body;
            if (!companyId || !name || !email) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ALL_FIELDS_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const employee = yield this._employeeService.addEmployee({
                companyId, name, email, coursesAssigned, position,
            });
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.CREATED, ResponseMessages_1.MESSAGES.EMPLOYEE_CREATED, true, employee);
        });
    }
    getAllEmployees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page = '1', limit = '10', search = '', sortBy = 'name', sortOrder = 'desc' } = req.query;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const employees = yield this._employeeService.getAllEmployees(companyId, Number(page), Number(limit), String(search), String(sortBy), String(sortOrder));
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
};
exports.CompanyEmployeeController = CompanyEmployeeController;
exports.CompanyEmployeeController = CompanyEmployeeController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyEmployeeService)),
    __metadata("design:paramtypes", [Object])
], CompanyEmployeeController);
