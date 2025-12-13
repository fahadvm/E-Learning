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
exports.StudentAuthController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const JWTtoken_1 = require("../../utils/JWTtoken");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const logger_1 = __importDefault(require("../../utils/logger"));
let StudentAuthController = class StudentAuthController {
    constructor(_studentAuthService) {
        this._studentAuthService = _studentAuthService;
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._studentAuthService.sendOtp(req.body);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.CREATED, ResponseMessages_1.MESSAGES.OTP_SENT, true);
        });
        this.verifyOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            if (!email || !otp)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_OTP_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const { token, refreshToken, user } = yield this._studentAuthService.verifyOtp(email, otp);
            (0, JWTtoken_1.setTokensInCookies)(res, token, refreshToken);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_VERIFIED, true, user);
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_PASSWORD_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const { token, refreshToken, user } = yield this._studentAuthService.login(email, password);
            (0, JWTtoken_1.setTokensInCookies)(res, token, refreshToken);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LOGIN_SUCCESS, true, user);
        });
        this.logout = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            (0, JWTtoken_1.clearTokens)(res);
            logger_1.default.info('student logout successful');
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LOGOUT_SUCCESS, true);
        });
        this.googleAuth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { tokenId } = req.body;
            if (!tokenId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.GOOGLE_AUTH_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const result = yield this._studentAuthService.googleAuth(tokenId);
            (0, JWTtoken_1.setTokensInCookies)(res, result.token, result.refreshToken);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.GOOGLE_AUTH_SUCCESS, true, result.user);
        });
        this.sendForgotPasswordOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._studentAuthService.sendForgotPasswordOtp(req.body.email);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_SENT, true);
        });
        this.verifyForgotOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            if (!email || !otp)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_OTP_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._studentAuthService.verifyForgotOtp(email, otp);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_VERIFIED, true);
        });
        this.setNewPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, newPassword } = req.body;
            if (!email || !newPassword)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_PASSWORD_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._studentAuthService.setNewPassword(email, newPassword);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PASSWORD_RESET_SUCCESS, true);
        });
        this.resendOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, purpose } = req.body;
            if (!email || !purpose)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_PURPOSE_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._studentAuthService.resendOtp(email, purpose);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_RESENT, true);
        });
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { currentPassword, newPassword } = req.body;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (!currentPassword || !newPassword)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.CURRENT_NEW_PASSWORD_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._studentAuthService.changePassword(studentId, currentPassword, newPassword);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PASSWORD_UPDATED_SUCCESS, true);
        });
        this.sendEmailChangeOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { newEmail } = req.body;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (!newEmail)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NEW_EMAIL_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._studentAuthService.sendEmailChangeOtp(studentId, newEmail);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_SENT_NEW_EMAIL, true);
        });
        this.verifyAndUpdateEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { newEmail, otp } = req.body;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (!newEmail || !otp)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_OTP_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const updatedUser = yield this._studentAuthService.verifyEmailChangeOtp(studentId, newEmail, otp);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.EMAIL_UPDATED_SUCCESS, true, updatedUser);
        });
    }
};
exports.StudentAuthController = StudentAuthController;
exports.StudentAuthController = StudentAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentAuthService)),
    __metadata("design:paramtypes", [Object])
], StudentAuthController);
