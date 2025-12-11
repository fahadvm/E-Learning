"use strict";
// services/company/CompanyEmployeeService.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyEmployeeService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const inversify_1 = require("inversify");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const types_1 = require("../../core/di/types");
const company_employee_Dto_1 = require("../../core/dtos/company/company.employee.Dto");
let CompanyEmployeeService = class CompanyEmployeeService {
    constructor(_employeeRepo, _companyRepo, _learningPathRepo, _purchaseRepo, _learningPathAssignRepo, _companyChatService) {
        this._employeeRepo = _employeeRepo;
        this._companyRepo = _companyRepo;
        this._learningPathRepo = _learningPathRepo;
        this._purchaseRepo = _purchaseRepo;
        this._learningPathAssignRepo = _learningPathAssignRepo;
        this._companyChatService = _companyChatService;
    } // Injected CompanyRepository
    getAllEmployees(companyId, page, limit, search, sortBy, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield this._employeeRepo.countEmployeesByCompany(companyId, search);
            const skip = (page - 1) * limit;
            const employees = yield this._employeeRepo.findByCompanyId(companyId, skip, limit, search, sortBy, sortOrder);
            const totalPages = Math.ceil(total / limit);
            return {
                employees: employees.map(company_employee_Dto_1.companyEmployeeDto),
                total,
                totalPages,
            };
        });
    }
    getEmployeeById(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._employeeRepo.findById(employeeId);
        });
    }
    blockEmployee(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this._employeeRepo.blockEmployee(id, status);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            yield this._employeeRepo.blockEmployee(id, status);
        });
    }
    updateEmployee(employeeId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._employeeRepo.updateById(employeeId, data);
        });
    }
    requestedEmployees(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this._employeeRepo.findRequestedEmployees(companyId);
            return courses;
        });
    }
    approvingEmployee(companyId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this._employeeRepo.findEmployeeAndApprove(companyId, employeeId);
            if (employee) {
                yield this._companyRepo.addEmployee(companyId, employeeId);
                // Add to Company Group Chat
                const company = yield this._companyRepo.findById(companyId);
                if (company) {
                    yield this._companyChatService.createCompanyGroup(companyId, company.name); // Ensure group exists
                    yield this._companyChatService.addEmployeeToGroup(companyId, employeeId);
                }
            }
            return employee;
        });
    }
    rejectingEmployee(employeeId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this._employeeRepo.findById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const updated = yield this._employeeRepo.updateById(employeeId, {
                status: 'rejected',
                rejectionReason: reason,
                rejectedAt: new Date(),
                requestedCompanyId: null
            });
            return updated;
        });
    }
    inviteEmployee(companyId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if employee exists
            const employee = yield this._employeeRepo.findByEmail(email);
            if (employee) {
                // Employee exists, send invitation
                if (employee.companyId) {
                    (0, ResANDError_1.throwError)('Employee already belongs to a company', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
                }
                if (employee.status === 'requested' || employee.status === 'invited') {
                    (0, ResANDError_1.throwError)('Employee already has a pending request or invitation', HttpStatuscodes_1.STATUS_CODES.CONFLICT);
                }
                const updated = yield this._employeeRepo.updateById(employee._id.toString(), {
                    requestedCompanyId: null, // Clear any previous request
                    status: 'invited',
                    invitedBy: new mongoose_1.default.Types.ObjectId(companyId),
                    invitedAt: new Date()
                });
                return updated;
            }
            // Employee doesn't exist - return null to indicate invitation link should be sent
            return null;
        });
    }
    searchEmployees(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._employeeRepo.searchByEmailOrName(query);
        });
    }
    removeEmployee(companyId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const employee = yield this._employeeRepo.findById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (((_a = employee.companyId) === null || _a === void 0 ? void 0 : _a.toString()) !== companyId) {
                (0, ResANDError_1.throwError)('Employee does not belong to this company', HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            }
            /* 1 Find assigned learning paths */
            const assignedPaths = yield this._learningPathAssignRepo.findAssigned(companyId, employeeId);
            console.log('checkpoint 1');
            /* 2 For each learning path → decrease seat usage */
            console.log("assignedPaths", assignedPaths);
            for (const path of assignedPaths) {
                console.log('checkpoint 1.5', companyId, path.learningPathId._id.toString());
                const lp = yield this._learningPathRepo.findOneForCompany(companyId, path.learningPathId._id.toString());
                console.log('checkpoint 1');
                if (lp) {
                    for (const course of lp.courses) {
                        yield this._purchaseRepo.decreaseSeatUsage(new mongoose_1.default.Types.ObjectId(companyId), new mongoose_1.default.Types.ObjectId(course.courseId.toString()));
                    }
                }
                console.log('checkpoint 1');
                /* 3️ Remove assigned progress */
                yield this._learningPathAssignRepo.delete(companyId, employeeId, path.learningPathId._id.toString());
            }
            console.log('checkpoint 1');
            /* 4️ Remove employee from company */
            yield this._employeeRepo.updateById(employeeId, {
                companyId: null,
                status: 'notRequsted'
            });
            yield this._companyRepo.removeEmployee(companyId, employeeId);
            // Remove from Company Group Chat
            yield this._companyChatService.removeEmployeeFromGroup(companyId, employeeId);
        });
    }
};
exports.CompanyEmployeeService = CompanyEmployeeService;
exports.CompanyEmployeeService = CompanyEmployeeService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.EmployeeRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CompanyRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.EmployeeLearningPathRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.CompanyCoursePurchaseRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.EmployeeLearningPathProgressRepository)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.CompanyChatService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], CompanyEmployeeService);
