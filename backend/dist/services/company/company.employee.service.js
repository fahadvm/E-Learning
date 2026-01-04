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
const leaderboard_1 = require("../../utils/redis/leaderboard");
let CompanyEmployeeService = class CompanyEmployeeService {
    constructor(_employeeRepo, _companyRepo, _learningPathRepo, _purchaseRepo, _learningPathAssignRepo, _companyChatService, _notificationService) {
        this._employeeRepo = _employeeRepo;
        this._companyRepo = _companyRepo;
        this._learningPathRepo = _learningPathRepo;
        this._purchaseRepo = _purchaseRepo;
        this._learningPathAssignRepo = _learningPathAssignRepo;
        this._companyChatService = _companyChatService;
        this._notificationService = _notificationService;
    } // Injected CompanyRepository
    getAllEmployees(companyId, page, limit, search, sortBy, sortOrder, department, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield this._employeeRepo.countEmployeesByCompany(companyId, search, department, position);
            const skip = (page - 1) * limit;
            const employees = yield this._employeeRepo.findByCompanyId(companyId, skip, limit, search, sortBy, sortOrder, department, position);
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
            var _a;
            const employee = yield this._employeeRepo.findById(id);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            yield this._employeeRepo.blockEmployee(id, status);
            const action = status ? 'blocked' : 'unblocked';
            const companyId = (_a = employee.companyId) === null || _a === void 0 ? void 0 : _a._id.toString();
            const company = companyId ? yield this._companyRepo.findById(companyId) : null;
            // Notify Company
            if (companyId) {
                yield this._notificationService.createNotification(companyId, `Employee ${action}`, `Employee ${employee.name} has been ${action}.`, 'employee', 'company', `/company/employees/${id}`);
            }
            // Notify Employee
            yield this._notificationService.createNotification(id, `Account ${action}`, `Your account has been ${action} by ${(company === null || company === void 0 ? void 0 : company.name) || 'the company'}.`, 'system', 'employee');
        });
    }
    updateEmployee(employeeId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("here updating employee profile:", data);
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
                    // Notify Company
                    yield this._notificationService.createNotification(companyId, 'New Employee Joined', `${employee.name} has joined the company.`, 'employee', 'company', `/company/employees/${employeeId}`);
                    // Notify Employee
                    yield this._notificationService.createNotification(employeeId, 'Application Approved', `Your request to join ${company.name} has been approved.`, 'system', 'employee', '/employee/dashboard');
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
            // Notify Employee
            yield this._notificationService.createNotification(employeeId, 'Application Rejected', `Your request to join the company has been rejected. Reason: ${reason}`, 'system', 'employee');
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
                    requestedCompanyId: null,
                    status: 'invited',
                    invitedBy: new mongoose_1.default.Types.ObjectId(companyId),
                    invitedAt: new Date()
                });
                const company = yield this._companyRepo.findById(companyId);
                // Notify Employee
                if (company) {
                    yield this._notificationService.createNotification(employee._id.toString(), 'New Invitation', `You have been invited to join ${company.name}.`, 'invitation', 'employee', '/employee/requests');
                }
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
            var _a, _b;
            const employee = yield this._employeeRepo.findById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (((_a = employee.companyId) === null || _a === void 0 ? void 0 : _a._id.toString()) !== companyId) {
                (0, ResANDError_1.throwError)('Employee does not belong to this company', HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            }
            /* 1 Find assigned learning paths */
            const assignedPaths = yield this._learningPathAssignRepo.findAssigned(companyId, employeeId);
            /* 2 For each learning path → decrease seat usage */
            for (const path of assignedPaths) {
                const lp = yield this._learningPathRepo.findOneForCompany(companyId, path.learningPathId._id.toString());
                if (lp) {
                    for (const course of lp.courses) {
                        yield this._purchaseRepo.decreaseSeatUsage(new mongoose_1.default.Types.ObjectId(companyId), new mongoose_1.default.Types.ObjectId(course.courseId.toString()));
                    }
                }
                /* 3️ Remove assigned progress */
                yield this._learningPathAssignRepo.delete(companyId, employeeId, path.learningPathId._id.toString());
            }
            /* 3.5 Decrease seat usage for individually assigned courses */
            const individualCourses = employee.coursesAssigned || [];
            for (const courseData of individualCourses) {
                const courseId = ((_b = courseData._id) === null || _b === void 0 ? void 0 : _b.toString()) || courseData.toString();
                yield this._purchaseRepo.decreaseSeatUsage(new mongoose_1.default.Types.ObjectId(companyId), new mongoose_1.default.Types.ObjectId(courseId));
            }
            /* 4️ Remove employee from company */
            yield this._employeeRepo.updateById(employeeId, {
                companyId: null,
                status: 'notRequsted'
            });
            yield this._companyRepo.removeEmployee(companyId, employeeId);
            // Remove from Leaderboard
            yield (0, leaderboard_1.removeFromCompanyLeaderboard)(companyId, employeeId);
            // Remove from Company Group Chat
            yield this._companyChatService.removeEmployeeFromGroup(companyId, employeeId);
            const company = yield this._companyRepo.findById(companyId);
            // Notify Company
            yield this._notificationService.createNotification(companyId, 'Employee Removed', `${employee.name} has been removed from the company.`, 'employee', 'company');
            // Notify Employee
            yield this._notificationService.createNotification(employeeId, 'Removed from Company', `You have been removed from ${(company === null || company === void 0 ? void 0 : company.name) || 'the company'}.`, 'system', 'employee');
        });
    }
    getEmployeeProgress(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._employeeRepo.getProgress(employeeId);
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
    __param(6, (0, inversify_1.inject)(types_1.TYPES.NotificationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], CompanyEmployeeService);
