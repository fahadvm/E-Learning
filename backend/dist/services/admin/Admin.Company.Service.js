"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AdminCompanyService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const mongoose_1 = __importDefault(require("mongoose"));
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const Admin_company_Dto_1 = require("../../core/dtos/admin/Admin.company.Dto");
let AdminCompanyService = class AdminCompanyService {
    constructor(_companyRepo, _employeeRepo, _purchasedRepo, _lpProgressRepo) {
        this._companyRepo = _companyRepo;
        this._employeeRepo = _employeeRepo;
        this._purchasedRepo = _purchasedRepo;
        this._lpProgressRepo = _lpProgressRepo;
    }
    getAllCompanies(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const companies = yield this._companyRepo.getAllCompanies(page, limit, search);
            const total = yield this._companyRepo.countCompanies(search);
            const totalPages = Math.ceil(total / limit);
            return { companies: companies.map(Admin_company_Dto_1.adminCompanyDto), total, totalPages };
        });
    }
    getCompanyById(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this._companyRepo.findById(companyId);
            if (!company)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const employees = company.employees || [];
            // Fetch accurate course usage from the devoted repository
            const companyIdObj = new mongoose_1.default.Types.ObjectId(companyId);
            const purchases = yield this._purchasedRepo.getAllPurchasesByCompany(companyIdObj);
            const courses = yield Promise.all(purchases.map((p) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const courseData = p.courseId;
                const courseId = ((_a = courseData._id) === null || _a === void 0 ? void 0 : _a.toString()) || p.courseId.toString();
                // Calculate dynamic counts to ensure data integrity
                const individualCount = employees.filter(emp => { var _a; return (_a = emp.coursesAssigned) === null || _a === void 0 ? void 0 : _a.some((id) => { var _a; return (((_a = id._id) === null || _a === void 0 ? void 0 : _a.toString()) || id.toString()) === courseId; }); }).length;
                const lpCount = yield this._lpProgressRepo.countAssignedSeats(companyId, courseId);
                return {
                    _id: courseId,
                    title: courseData.title || "Unknown Course",
                    seatsPurchased: p.seatsPurchased,
                    seatsUsed: Math.max(p.seatsUsed, individualCount, lpCount)
                };
            })));
            // Process employees with learning path data
            const employeesWithLPData = yield Promise.all(employees.map((emp) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const lpProgress = yield this._lpProgressRepo.findByEmployeeId(emp._id.toString());
                let totalCourses = 0;
                let completedCourses = 0;
                if (lpProgress && lpProgress.learningPathId) {
                    const EmployeeLearningPath = (yield Promise.resolve().then(() => __importStar(require('../../models/EmployeeLearningPath')))).EmployeeLearningPath;
                    const learningPath = yield EmployeeLearningPath.findById(lpProgress.learningPathId);
                    if (learningPath) {
                        totalCourses = ((_a = learningPath.courses) === null || _a === void 0 ? void 0 : _a.length) || 0;
                        completedCourses = ((_b = lpProgress.completedCourses) === null || _b === void 0 ? void 0 : _b.length) || 0;
                    }
                }
                // If no learning path, fall back to directly assigned courses
                if (totalCourses === 0) {
                    totalCourses = ((_c = emp.coursesAssigned) === null || _c === void 0 ? void 0 : _c.length) || 0;
                    completedCourses = ((_d = emp.coursesProgress) === null || _d === void 0 ? void 0 : _d.filter(cp => cp.percentage >= 100).length) || 0;
                }
                return {
                    _id: emp._id.toString(),
                    name: emp.name,
                    email: emp.email,
                    position: emp.position,
                    avatar: emp.profilePicture,
                    isBlocked: emp.isBlocked,
                    coursesAssigned: totalCourses,
                    coursesCompleted: completedCourses
                };
            })));
            return {
                company: (0, Admin_company_Dto_1.adminCompanyDto)(company),
                employees: employeesWithLPData,
                courses
            };
        });
    }
    getUnverifiedCompanies(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const companies = yield this._companyRepo.getUnverifiedCompanies(page, limit, search);
            const total = yield this._companyRepo.countUnverifiedCompanies(search);
            const totalPages = Math.ceil(total / limit);
            return { companies: companies.map(Admin_company_Dto_1.adminCompanyDto), total, totalPages };
        });
    }
    getEmployeeById(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this._employeeRepo.findById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Admin_company_Dto_1.adminCompanyEmployeeDto)(employee);
        });
    }
    verifyCompany(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._companyRepo.verifyCompany(companyId);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Admin_company_Dto_1.adminCompanyDto)(updated);
        });
    }
    rejectCompany(companyId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._companyRepo.rejectCompany(companyId, reason);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Admin_company_Dto_1.adminCompanyDto)(updated);
        });
    }
    blockCompany(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._companyRepo.blockCompany(companyId);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Admin_company_Dto_1.adminCompanyDto)(updated);
        });
    }
    unblockCompany(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._companyRepo.unblockCompany(companyId);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Admin_company_Dto_1.adminCompanyDto)(updated);
        });
    }
    approveAllCompanies() {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._companyRepo.approveAll();
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return updated;
        });
    }
    rejectAllCompanies(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._companyRepo.rejectAll(reason);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return updated;
        });
    }
};
exports.AdminCompanyService = AdminCompanyService;
exports.AdminCompanyService = AdminCompanyService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.EmployeeRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CompanyCoursePurchaseRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.EmployeeLearningPathProgressRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AdminCompanyService);
