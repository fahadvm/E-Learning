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
exports.CompanyProfileController = void 0;
const inversify_1 = require("inversify");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResANDError_1 = require("../../utils/ResANDError");
const JWTtoken_1 = require("../../utils/JWTtoken");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const types_1 = require("../../core/di/types");
let CompanyProfileController = class CompanyProfileController {
    constructor(_companyService) {
        this._companyService = _companyService;
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, JWTtoken_1.decodeToken)(req.cookies.token);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const company = yield this._companyService.getProfile(decoded.id);
            if (!company)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COMPANY_DETAILS_FETCHED, true, company);
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { name, address, phone, companyId, pincode } = req.body;
            const certificateFile = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.certificate) === null || _b === void 0 ? void 0 : _b[0];
            const taxIdFile = (_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c.taxId) === null || _d === void 0 ? void 0 : _d[0];
            if (!certificateFile || !taxIdFile) {
                (0, ResANDError_1.throwError)("Both certificate & taxId are required", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const verification = yield this._companyService.requestVerification(companyId, name, address, pincode, phone, certificateFile, taxIdFile);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COMPANY_VERIFICATION_SUBMITTED, true, verification);
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, JWTtoken_1.decodeToken)(req.cookies.token);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const companyId = decoded.id;
            const updatedData = req.body;
            const updatedCompany = yield this._companyService.updateProfile(companyId, updatedData);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COMPANY_UPDATED, true, updatedCompany);
        });
    }
    // Email Change - Send OTP
    sendEmailChangeOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, JWTtoken_1.decodeToken)(req.cookies.token);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { newEmail } = req.body;
            if (!newEmail)
                (0, ResANDError_1.throwError)("New email is required", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) {
                (0, ResANDError_1.throwError)("Invalid email format", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            yield this._companyService.sendEmailChangeOTP(decoded.id, newEmail);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, "OTP sent to new email address", true, null);
        });
    }
    // Email Change - Verify OTP
    verifyEmailChangeOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, JWTtoken_1.decodeToken)(req.cookies.token);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { newEmail, otp } = req.body;
            if (!newEmail || !otp)
                (0, ResANDError_1.throwError)("Email and OTP are required", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const updated = yield this._companyService.verifyEmailChangeOTP(decoded.id, newEmail, otp);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, "Email updated successfully", true, updated);
        });
    }
    // Change Password
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, JWTtoken_1.decodeToken)(req.cookies.token);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                (0, ResANDError_1.throwError)("Current password and new password are required", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            yield this._companyService.changePassword(decoded.id, currentPassword, newPassword);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, "Password changed successfully", true, null);
        });
    }
};
exports.CompanyProfileController = CompanyProfileController;
exports.CompanyProfileController = CompanyProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyProfileService)),
    __metadata("design:paramtypes", [Object])
], CompanyProfileController);
