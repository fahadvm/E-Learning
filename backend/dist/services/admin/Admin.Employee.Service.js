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
exports.AdminEmployeeService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const Admin_employee_Dto_1 = require("../../core/dtos/admin/Admin.employee.Dto");
let AdminEmployeeService = class AdminEmployeeService {
    constructor(_employeeRepo) {
        this._employeeRepo = _employeeRepo;
    }
    getEmployeesByCompany(companyId, page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const employees = yield this._employeeRepo.getEmployeesByCompany(companyId, page, limit, search);
            const total = yield this._employeeRepo.countEmployeesByCompany(companyId, search);
            const totalPages = Math.ceil(total / limit);
            return {
                data: employees.map(Admin_employee_Dto_1.adminEmployeeDto),
                total,
                totalPages
            };
        });
    }
    getEmployeeById(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this._employeeRepo.findById(employeeId);
            return employee ? (0, Admin_employee_Dto_1.adminEmployeeDto)(employee) : null;
        });
    }
    blockEmployee(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this._employeeRepo.blockEmployee(employeeId);
            return employee ? (0, Admin_employee_Dto_1.adminEmployeeDto)(employee) : null;
        });
    }
    unblockEmployee(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this._employeeRepo.unblockEmployee(employeeId);
            return employee ? (0, Admin_employee_Dto_1.adminEmployeeDto)(employee) : null;
        });
    }
};
exports.AdminEmployeeService = AdminEmployeeService;
exports.AdminEmployeeService = AdminEmployeeService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.EmployeeRepository)),
    __metadata("design:paramtypes", [Object])
], AdminEmployeeService);
