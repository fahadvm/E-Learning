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
exports.StudentAuthService = void 0;
// src/services/student/StudentAuthService.ts
const inversify_1 = require("inversify");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ResANDError_1 = require("../../utils/ResANDError");
const JWTtoken_1 = require("../../utils/JWTtoken");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const OtpServices_1 = require("../../utils/OtpServices");
const google_auth_library_1 = require("google-auth-library");
const types_1 = require("../../core/di/types");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const GOOGLE_CLIENT_ID = '1009449170165-l51vq71vru9hqefmkl570nf782455uf1.apps.googleusercontent.com';
let StudentAuthService = class StudentAuthService {
    constructor(_studentRepo, _otpRepo) {
        this._studentRepo = _studentRepo;
        this._otpRepo = _otpRepo;
        this._googleClient = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
    }
    handleOtp(email, purpose, tempUserData) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = (0, OtpServices_1.generateOtp)();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            const existingOtp = yield this._otpRepo.findByEmail(email);
            if (existingOtp)
                yield this._otpRepo.updateOtp(email, otp, expiresAt, purpose, tempUserData);
            else
                yield this._otpRepo.create({ email, otp, expiresAt, purpose, tempUserData });
            yield (0, OtpServices_1.sendOtpEmail)(email, otp);
        });
    }
    sendOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name, password } = data;
            if (!email || !name || !password)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ALL_FIELDS_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const existingStudent = yield this._studentRepo.findByEmail(email);
            if (existingStudent)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_ALREADY_EXISTS, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            yield this.handleOtp(email, 'signup', { name, password: hashedPassword });
        });
    }
    resendOtp(email, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this._otpRepo.findByEmail(email);
            if (!existing)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NO_OTP_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (existing.purpose !== purpose)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.OTP_PURPOSE_MISMATCH, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this.handleOtp(email, purpose);
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield this._otpRepo.findByEmail(email);
            if (!record || record.otp !== otp || record.expiresAt < new Date())
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.OTP_INVALID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            if (!record.tempUserData)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEMP_USER_DATA_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const { name, password } = record.tempUserData;
            const student = yield this._studentRepo.create({ name, email, password, isVerified: true, isBlocked: false });
            yield this._otpRepo.deleteByEmail(email);
            const token = (0, JWTtoken_1.generateAccessToken)(student._id.toString(), 'student');
            const refreshToken = (0, JWTtoken_1.generateRefreshToken)(student._id.toString(), 'student');
            return { token, refreshToken, user: { id: student._id.toString(), role: 'student', email: student.email, name: student.name } };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepo.findByEmail(email);
            if (!student || !student.password)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_CREDENTIALS, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const match = yield bcryptjs_1.default.compare(password, student.password);
            if (!match)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_CREDENTIALS, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            if (!student.isVerified)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.VERIFY_EMAIL, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            if (student.isBlocked)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ACCOUNT_BLOCKED, HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            const token = (0, JWTtoken_1.generateAccessToken)(student._id.toString(), 'student');
            const refreshToken = (0, JWTtoken_1.generateRefreshToken)(student._id.toString(), 'student');
            return { token, refreshToken, user: { id: student._id.toString(), role: 'student', email: student.email, name: student.name } };
        });
    }
    googleAuth(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = yield this._googleClient.verifyIdToken({
                idToken,
                audience: GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload)
                throw new Error('Invalid Google token payload');
            console.log('Expected Audience:', GOOGLE_CLIENT_ID);
            console.log('Actual Audience from token:', payload.aud);
            const { sub: googleId, email, name } = payload;
            if (!googleId || !email)
                throw new Error('Google token missing required fields');
            let user = yield this._studentRepo.findByGoogleId(googleId);
            if (!user)
                user = yield this._studentRepo.findByEmail(email);
            if (!user) {
                user = yield this._studentRepo.create({
                    googleId,
                    email,
                    name,
                    isVerified: true,
                    isBlocked: false,
                    role: 'student',
                });
            }
            else if (!user.googleId) {
                throw new Error('User is not linked to Google');
            }
            const token = (0, JWTtoken_1.generateAccessToken)(user._id.toString(), user.role);
            const refreshToken = (0, JWTtoken_1.generateRefreshToken)(user._id.toString(), user.role);
            return {
                token, // matches interface
                refreshToken,
                user: {
                    id: user._id.toString(),
                    role: 'student',
                },
            };
        });
    }
    sendForgotPasswordOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepo.findByEmail(email);
            if (!student)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            yield this.handleOtp(email, 'forgot-password');
        });
    }
    verifyForgotOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield this._otpRepo.findByEmail(email);
            if (!record || record.purpose !== 'forgot-password')
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.OTP_NOT_VALID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            if (record.otp !== otp || record.expiresAt < new Date())
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.OTP_INVALID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
        });
    }
    setNewPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepo.findByEmail(email);
            if (!student)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            yield this._studentRepo.updateByEmail(email, { password: hashedPassword });
            yield this._otpRepo.deleteByEmail(email);
        });
    }
};
exports.StudentAuthService = StudentAuthService;
exports.StudentAuthService = StudentAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.OtpRepository)),
    __metadata("design:paramtypes", [Object, Object])
], StudentAuthService);
