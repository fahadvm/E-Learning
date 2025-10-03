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
exports.AdminCompanyController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const validatePagination_1 = require("../../utils/validatePagination");
let AdminCompanyController = class AdminCompanyController {
    constructor(_companyService) {
        this._companyService = _companyService;
    }
    getAllCompanies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = '1', limit = '10', search = '' } = req.query;
            const { pageNum, limitNum, error } = (0, validatePagination_1.validatePagination)(String(page), String(limit));
            if (error || pageNum === null || limitNum === null) {
                return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST, error, false);
            }
            const result = yield this._companyService.getAllCompanies(pageNum, limitNum, String(search || ''));
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COMPANIES_FETCHED, true, result);
        });
    }
    getUnverifiedCompanies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = '1', limit = '10', search = '' } = req.query;
            const { pageNum, limitNum, error } = (0, validatePagination_1.validatePagination)(String(page), String(limit));
            if (error || pageNum === null || limitNum === null) {
                return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST, error, false);
            }
            const companies = yield this._companyService.getUnverifiedCompanies(pageNum, limitNum, String(search || ''));
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.UNVERIFIED_COMPANIES_FETCHED, true, companies);
        });
    }
    verifyCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyId } = req.params;
            const updatedCompany = yield this._companyService.verifyCompany(companyId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.VERIFIED, true, updatedCompany);
        });
    }
    getCompayById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyId } = req.params;
            const company = yield this._companyService.getCompanyById(companyId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COMPANY_DETAILS_FETCHED, true, company);
        });
    }
    getEmployeeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employeeId } = req.params;
            console.log('here request reached with :', employeeId);
            const employee = yield this._companyService.getEmployeeById(employeeId);
            console.log('came back to controller ', employee);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.EMPLOYEE_DETAILS_FETCHED, true, employee);
        });
    }
    rejectCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyId } = req.params;
            const { rejectReason } = req.body;
            const updatedCompany = yield this._companyService.rejectCompany(companyId, rejectReason);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.REJECTED, true, updatedCompany);
        });
    }
    blockCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyId } = req.params;
            const updatedCompany = yield this._companyService.blockCompany(companyId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COMPANY_BLOCKED, true, updatedCompany);
        });
    }
    unblockCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyId } = req.params;
            const updatedCompany = yield this._companyService.unblockCompany(companyId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COMPANY_UNBLOCKED, true, updatedCompany);
        });
    }
    approveAllCompanies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCompany = yield this._companyService.approveAllCompanies();
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.APPROVED, true, updatedCompany);
        });
    }
    rejectAllCompanies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rejectReason } = req.body;
            const updatedCompany = yield this._companyService.rejectAllCompanies(rejectReason);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.REJECTED, true, updatedCompany);
        });
    }
};
exports.AdminCompanyController = AdminCompanyController;
exports.AdminCompanyController = AdminCompanyController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminCompanyService)),
    __metadata("design:paramtypes", [Object])
], AdminCompanyController);
