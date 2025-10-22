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
    EmployeeStatus["PENDING"] = "pending";
    EmployeeStatus["APPROVED"] = "approved";
    EmployeeStatus["NOT_REQUEST"] = "notRequest";
})(EmployeeStatus || (exports.EmployeeStatus = EmployeeStatus = {}));
let EmployeeCompanyService = class EmployeeCompanyService {
    constructor(companyRepo, employeeRepo) {
        this.companyRepo = companyRepo;
        this.employeeRepo = employeeRepo;
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
            if (employee.status === EmployeeStatus.PENDING)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ALREADY_REQUESTED_COMPANY, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            const requestedCompanyId = new mongoose_1.default.Types.ObjectId(companyId);
            yield this.employeeRepo.updateById(employeeId, { requestedCompanyId, status: EmployeeStatus.PENDING });
        });
    }
    cancelRequest(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.employeeRepo.findById(employeeId);
            if (!employee || employee.status === EmployeeStatus.NOT_REQUEST)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NO_REQUEST_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            yield this.employeeRepo.updateCancelRequestById(employeeId);
        });
    }
    leaveCompany(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.employeeRepo.findById(employeeId);
            if (!employee || employee.status !== EmployeeStatus.APPROVED)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_PART_OF_COMPANY, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this.employeeRepo.updateById(employeeId, {
                status: EmployeeStatus.NOT_REQUEST,
                companyId: undefined,
            });
        });
    }
};
exports.EmployeeCompanyService = EmployeeCompanyService;
exports.EmployeeCompanyService = EmployeeCompanyService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.EmployeeRepository)),
    __metadata("design:paramtypes", [Object, Object])
], EmployeeCompanyService);
