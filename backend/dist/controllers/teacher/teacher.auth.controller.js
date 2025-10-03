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
exports.TeacherAuthController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const JWTtoken_1 = require("../../utils/JWTtoken");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let TeacherAuthController = class TeacherAuthController {
    constructor(_teacherAuthService) {
        this._teacherAuthService = _teacherAuthService;
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._teacherAuthService.sendOtp(req.body);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.CREATED, ResponseMessages_1.MESSAGES.OTP_SENT, true);
        });
        this.verifyOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            if (!email || !otp)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_OTP_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const { token, refreshToken, user } = yield this._teacherAuthService.verifyOtp(email, otp);
            (0, JWTtoken_1.setTokensInCookies)(res, token, refreshToken);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_VERIFIED, true, user);
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_PASSWORD_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const { token, refreshToken, user } = yield this._teacherAuthService.login(email, password);
            (0, JWTtoken_1.setTokensInCookies)(res, token, refreshToken);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LOGIN_SUCCESS, true, user);
        });
        this.logout = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            (0, JWTtoken_1.clearTokens)(res);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LOGOUT_SUCCESS, true);
        });
        //   googleAuth = async (req: Request, res: Response) => {
        //     const { email, googleId } = req.body;
        //     if (!email || !googleId) throwError(MESSAGES.GOOGLE_AUTH_REQUIRED, STATUS_CODES.BAD_REQUEST);
        //     const r = await this._teacherAuthService.googleAuth(req.body);
        //     setTokensInCookies(res, r.token, r.refreshToken);
        //     return sendResponse(res, STATUS_CODES.OK, MESSAGES.GOOGLE_AUTH_SUCCESS, true, r.user);
        //   };
        this.sendForgotPasswordOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._teacherAuthService.sendForgotPasswordOtp(req.body.email);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_SENT, true);
        });
        this.verifyForgotOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            if (!email || !otp)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_OTP_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._teacherAuthService.verifyForgotOtp(email, otp);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_VERIFIED, true);
        });
        this.setNewPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, newPassword } = req.body;
            if (!email || !newPassword)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_PASSWORD_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._teacherAuthService.setNewPassword(email, newPassword);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PASSWORD_RESET_SUCCESS, true);
        });
        this.resendOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, purpose } = req.body;
            if (!email || !purpose)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_PURPOSE_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._teacherAuthService.resendOtp(email, purpose);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.OTP_RESENT, true);
        });
    }
};
exports.TeacherAuthController = TeacherAuthController;
exports.TeacherAuthController = TeacherAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TeacherAuthService)),
    __metadata("design:paramtypes", [Object])
], TeacherAuthController);
