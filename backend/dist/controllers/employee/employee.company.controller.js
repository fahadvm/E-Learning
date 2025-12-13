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
exports.EmployeeCompanyController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
let EmployeeCompanyController = class EmployeeCompanyController {
    constructor(_employeeCompanyService) {
        this._employeeCompanyService = _employeeCompanyService;
    }
    getCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._employeeCompanyService.getMyCompany(req.user.id);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COMPANY_FETCHED, true, result);
        });
    }
    requestedCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._employeeCompanyService.getRequestedCompany(req.user.id);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COMPANY_FETCHED, true, result);
        });
    }
    findCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companycode } = req.body;
            const result = yield this._employeeCompanyService.findCompanyByCode(companycode);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COMPANY_FOUND, true, result);
        });
    }
    sendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyId } = req.body;
            yield this._employeeCompanyService.sendRequest(req.user.id, companyId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.REQUEST_SENT, true);
        });
    }
    cancelRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._employeeCompanyService.cancelRequest(req.user.id);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.REQUEST_CANCELLED, true, result);
        });
    }
    leaveCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._employeeCompanyService.leaveCompany(req.user.id);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LEFT_COMPANY, true);
        });
    }
    getInvitation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._employeeCompanyService.getInvitation(req.user.id);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.INVITATION_FETCHED, true, result);
        });
    }
    acceptInvite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._employeeCompanyService.acceptInvite(req.user.id);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.INVITATION_ACCEPTED, true);
        });
    }
    rejectInvite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._employeeCompanyService.rejectInvite(req.user.id);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.INVITATION_REJECTED, true);
        });
    }
};
exports.EmployeeCompanyController = EmployeeCompanyController;
exports.EmployeeCompanyController = EmployeeCompanyController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.EmployeeCompanyService)),
    __metadata("design:paramtypes", [Object])
], EmployeeCompanyController);
