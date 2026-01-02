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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeCompanyService = exports.EmployeeStatus = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const mongoose_1 = __importDefault(require("mongoose"));
var EmployeeStatus;
(function (EmployeeStatus) {
    EmployeeStatus["REQUESTED"] = "requested";
    EmployeeStatus["APPROVED"] = "approved";
    EmployeeStatus["REVOKED"] = "revoked";
    EmployeeStatus["NONE"] = "notRequsted";
    EmployeeStatus["INVITED"] = "invited";
    EmployeeStatus["REJECTED"] = "rejected";
})(EmployeeStatus || (exports.EmployeeStatus = EmployeeStatus = {}));
let EmployeeCompanyService = class EmployeeCompanyService {
    constructor(companyRepo, employeeRepo, _assignRepo, _learningPathRepo, _purchaseRepo) {
        this.companyRepo = companyRepo;
        this.employeeRepo = employeeRepo;
        this._assignRepo = _assignRepo;
        this._learningPathRepo = _learningPathRepo;
        this._purchaseRepo = _purchaseRepo;
    }
    getMyCompany(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this.employeeRepo.findCompanyByEmployeeId(employeeId);
            return company;
        });
    }
    getRequestedCompany(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this.employeeRepo.findRequestedCompanyByEmployeeId(employeeId);
            return company;
        });
    }
    getInvitation(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.employeeRepo.findById(employeeId);
            if (!employee || !employee.invitedBy)
                return null;
            // Populate invitedBy to get company details
            // Assuming findById populates or we can do a separate fetch
            // If invitedBy is just ID, we need to fetch company
            const company = yield this.companyRepo.findById(employee.invitedBy.toString());
            return company;
        });
    }
    acceptInvite(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.employeeRepo.findById(employeeId);
            if (!employee || !employee.invitedBy)
                (0, ResANDError_1.throwError)('No invitation found', HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            yield this.employeeRepo.updateById(employeeId, {
                companyId: employee.invitedBy,
                invitedBy: null,
                invitedAt: null,
                status: 'approved', // Active/Approved
                // Clear any request
                requestedCompanyId: null
            });
            // Also need to add employee to company's employee list!
            // This logic might be better in a "CompanyService" but we do it here
            yield this.companyRepo.addEmployee(employee.invitedBy.toString(), employeeId);
        });
    }
    rejectInvite(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.employeeRepo.findById(employeeId);
            if (!employee || !employee.invitedBy)
                (0, ResANDError_1.throwError)('No invitation found', HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            yield this.employeeRepo.updateById(employeeId, {
                invitedBy: null,
                invitedAt: null,
                status: 'notRequsted'
            });
        });
    }
    findCompanyByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this.companyRepo.findByCompanyCode(code);
            if (!company)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return company;
        });
    }
    sendRequest(employeeId, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.employeeRepo.findById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (employee.status === EmployeeStatus.REQUESTED || employee.status === EmployeeStatus.INVITED)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ALREADY_REQUESTED_COMPANY, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            const requestedCompanyId = new mongoose_1.default.Types.ObjectId(companyId);
            yield this.employeeRepo.updateById(employeeId, { requestedCompanyId, status: EmployeeStatus.REQUESTED });
        });
    }
    cancelRequest(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.employeeRepo.findById(employeeId);
            if (!employee || employee.status === EmployeeStatus.NONE)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NO_REQUEST_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            yield this.employeeRepo.updateCancelRequestById(employeeId);
        });
    }
    leaveCompany(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const employee = yield this.employeeRepo.findById(employeeId);
            if (!employee || employee.status !== EmployeeStatus.APPROVED)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_PART_OF_COMPANY, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const companyId = (_a = employee.companyId) === null || _a === void 0 ? void 0 : _a._id.toString();
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_PART_OF_COMPANY, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            // 🔎 Find all assigned learning paths for this employee
            const assignedPaths = yield this._assignRepo.findAssigned(companyId, employeeId);
            for (const path of assignedPaths) {
                const lp = yield this._learningPathRepo.findOneForCompany(companyId, path.learningPathId._id.toString());
                if (!lp)
                    continue;
                // 🔻 Decrease seat usage for each course in the learning path
                for (const course of lp.courses) {
                    yield this._purchaseRepo.decreaseSeatUsage(new mongoose_1.default.Types.ObjectId(companyId), new mongoose_1.default.Types.ObjectId(course.courseId.toString()));
                }
                // 🗑 Remove progress assignment
                yield this._assignRepo.delete(companyId, employeeId, path.learningPathId._id.toString());
            }
            // 🧹 Remove employee from the company
            yield this.employeeRepo.updateById(employeeId, {
                status: EmployeeStatus.NONE,
                companyId: null,
            });
            yield this.companyRepo.removeEmployee(companyId, employeeId);
        });
    }
};
exports.EmployeeCompanyService = EmployeeCompanyService;
exports.EmployeeCompanyService = EmployeeCompanyService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.EmployeeRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.EmployeeLearningPathProgressRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.EmployeeLearningPathRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.CompanyCoursePurchaseRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], EmployeeCompanyService);
