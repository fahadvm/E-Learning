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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyEmployeeService = void 0;
const inversify_1 = require("inversify");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const types_1 = require("../../core/di/types");
const company_employee_Dto_1 = require("../../core/dtos/company/company.employee.Dto");
let CompanyEmployeeService = class CompanyEmployeeService {
    constructor(_employeeRepo) {
        this._employeeRepo = _employeeRepo;
    }
    // async addEmployee(data: {
    //     companyId: string;
    //     name: string;
    //     email: string;
    //     password?: string;
    //     coursesAssigned?: string[];
    //     position: string;
    // }): Promise<any> {
    //     const existing = await this._employeeRepo.findByEmail(data.email);
    //     if (existing) {
    //         throwError(MESSAGES.ALREADY_EXISTS, STATUS_CODES.CONFLICT);
    //     }
    //     const tempPassword = 'Temp@' + generateOtp();
    //     console.log(`new employee added email :${data.email} & password :${tempPassword}`);
    //     const hashedPassword = tempPassword
    //         ? await bcrypt.hash(tempPassword, 10)
    //         : undefined;
    //     const newEmployee = await this._employeeRepo.create({
    //         ...data,
    //         password: hashedPassword,
    //     });
    //     await sendOtpEmail(data.email, tempPassword);
    //     return newEmployee;
    // }
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
            return yield this._employeeRepo.updateEmployeeById(employeeId, data);
        });
    }
};
exports.CompanyEmployeeService = CompanyEmployeeService;
exports.CompanyEmployeeService = CompanyEmployeeService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.EmployeeRepository)),
    __metadata("design:paramtypes", [Object])
], CompanyEmployeeService);
