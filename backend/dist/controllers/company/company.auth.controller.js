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
exports.CompanyAuthController = void 0;
const inversify_1 = require("inversify");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResANDError_1 = require("../../utils/ResANDError");
const JWTtoken_1 = require("../../utils/JWTtoken");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const types_1 = require("../../core/di/types");
const logger_1 = __importDefault(require("../../utils/logger"));
let CompanyAuthController = class CompanyAuthController {
    constructor(_companyService) {
        this._companyService = _companyService;
    }
    sendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ALL_FIELDS_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            yield this._companyService.sendOtp({ name, email, password });
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.CREATED, ResponseMessages_1.MESSAGES.OTP_SENT, true);
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info('verifying otp ', req.body);
            const { email, otp } = req.body;
            if (!email || !otp)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ALL_FIELDS_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const company = yield this._companyService.verifyOtp(email, otp);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_VERIFIED, true, company);
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ALL_FIELDS_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const { token, refreshToken, company } = yield this._companyService.login(email, password);
            (0, JWTtoken_1.setTokensInCookies)(res, token, refreshToken);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LOGIN_SUCCESS, true, company);
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, JWTtoken_1.clearTokens)(res);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LOGOUT_SUCCESS, true);
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._companyService.forgotPassword(email);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_SENT, true);
        });
    }
    verifyForgotOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            if (!email || !otp)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ALL_FIELDS_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._companyService.verifyForgotOtp(email, otp);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_VERIFIED, true);
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, newPassword } = req.body;
            if (!email || !newPassword) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ALL_FIELDS_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            yield this._companyService.resetPassword(email, newPassword);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PASSWORD_RESET_SUCCESS, true);
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._companyService.resendForgotPasswordOtp(email);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_RESENT, true);
        });
    }
};
exports.CompanyAuthController = CompanyAuthController;
exports.CompanyAuthController = CompanyAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyAuthService)),
    __metadata("design:paramtypes", [Object])
], CompanyAuthController);
