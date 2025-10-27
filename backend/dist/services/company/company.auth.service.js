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
exports.CompanyAuthService = void 0;
const inversify_1 = require("inversify");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const OtpServices_1 = require("../../utils/OtpServices");
const JWTtoken_1 = require("../../utils/JWTtoken");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const types_1 = require("../../core/di/types");
const nanoid_1 = require("nanoid");
const nanoid = (0, nanoid_1.customAlphabet)('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);
let CompanyAuthService = class CompanyAuthService {
    constructor(_companyRepository, _otpRepository) {
        this._companyRepository = _companyRepository;
        this._otpRepository = _otpRepository;
    }
    sendOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = data;
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const purpose = 'signup';
            const otp = (0, OtpServices_1.generateOtp)();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            let tempUserData = { name, password };
            const existingOtp = yield this._companyRepository.findByEmail(email);
            if (existingOtp)
                yield this._otpRepository.updateOtp(email, otp, expiresAt, purpose, tempUserData);
            yield this._otpRepository.create({
                email,
                otp,
                expiresAt,
                tempUserData: { name, password: hashedPassword },
            });
            yield (0, OtpServices_1.sendOtpEmail)(email, otp);
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const tempData = yield this._otpRepository.findByEmail(email);
            if (!tempData)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (tempData.otp !== otp || tempData.expiresAt < new Date()) {
                yield this._otpRepository.deleteByEmail(email);
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.OTP_INVALID, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            }
            const existingCompany = yield this._companyRepository.findByEmail(email);
            if (existingCompany)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.VERIFIED, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            let companyCode = nanoid();
            while (yield this._companyRepository.findByCompanyCode(companyCode)) {
                companyCode = nanoid();
            }
            const newCompany = yield this._companyRepository.create({
                email: tempData.email,
                name: (_b = (_a = tempData.tempUserData) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '',
                password: (_d = (_c = tempData.tempUserData) === null || _c === void 0 ? void 0 : _c.password) !== null && _d !== void 0 ? _d : '',
                companyCode,
            });
            yield this._otpRepository.deleteByEmail(email);
            return newCompany;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this._companyRepository.findByEmail(email);
            if (!company)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const isMatch = yield bcryptjs_1.default.compare(password, company.password);
            if (!isMatch)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_CREDENTIALS, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const companyId = company.id.toString();
            const token = (0, JWTtoken_1.generateAccessToken)(companyId, 'company');
            const refreshToken = (0, JWTtoken_1.generateRefreshToken)(companyId, 'company');
            return { token, refreshToken, company: { id: companyId, name: company.name, email: company.email } };
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this._companyRepository.findByEmail(email);
            if (!company)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const otp = (0, OtpServices_1.generateOtp)();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            yield this._otpRepository.create({ email, otp, expiresAt, purpose: 'forgot-password' });
            yield (0, OtpServices_1.sendOtpEmail)(email, otp);
        });
    }
    verifyForgotOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const tempData = yield this._otpRepository.findByEmail(email, 'forgot-password');
            if (!tempData || tempData.otp !== otp)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.OTP_EXPIRED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            if (tempData.expiresAt < new Date()) {
                yield this._otpRepository.deleteByEmail(email, 'forgot-password');
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.OTP_EXPIRED, HttpStatuscodes_1.STATUS_CODES.GONE);
            }
        });
    }
    resetPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this._companyRepository.findByEmail(email);
            if (!company)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const hashed = yield bcryptjs_1.default.hash(newPassword, 10);
            yield this._companyRepository.updatePassword(email, hashed);
            yield this._otpRepository.deleteByEmail(email, 'forgot-password');
        });
    }
    resendForgotPasswordOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this._companyRepository.findByEmail(email);
            if (!company)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const otp = (0, OtpServices_1.generateOtp)();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            yield this._otpRepository.updateOtp(email, otp, expiresAt, 'forgot-password');
            yield (0, OtpServices_1.sendOtpEmail)(email, otp);
        });
    }
};
exports.CompanyAuthService = CompanyAuthService;
exports.CompanyAuthService = CompanyAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.OtpRepository)),
    __metadata("design:paramtypes", [Object, Object])
], CompanyAuthService);
