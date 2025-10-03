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
exports.TeacherAuthService = void 0;
const inversify_1 = require("inversify");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ResANDError_1 = require("../../utils/ResANDError");
const JWTtoken_1 = require("../../utils/JWTtoken");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const OtpServices_1 = require("../../utils/OtpServices");
// import { GooglePayLoad } from "../../types/userTypes";
// import { verifyGoogleIdToken } from "../../utils/googleVerify";
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const types_1 = require("../../core/di/types");
let TeacherAuthService = class TeacherAuthService {
    constructor(_teacherRepo, _otpRepository) {
        this._teacherRepo = _teacherRepo;
        this._otpRepository = _otpRepository;
    }
    sendOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, name } = data;
            if (!email || !password || !name)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ALL_FIELDS_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            if (yield this._teacherRepo.findByEmail(email))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_ALREADY_EXISTS, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const otp = (0, OtpServices_1.generateOtp)();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            const otpData = { email, otp, expiresAt, purpose: 'signup', tempUserData: { name, password: hashedPassword } };
            const existingOtp = yield this._otpRepository.findByEmail(email);
            existingOtp
                ? yield this._otpRepository.updateOtp(email, otp, expiresAt, 'signup', otpData.tempUserData)
                : yield this._otpRepository.create(otpData);
            yield (0, OtpServices_1.sendOtpEmail)(email, otp);
        });
    }
    resendOtp(email, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this._otpRepository.findByEmail(email);
            if (!existing)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NO_OTP_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (existing.purpose !== purpose)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.OTP_PURPOSE_MISMATCH, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const newOtp = (0, OtpServices_1.generateOtp)();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            yield this._otpRepository.updateOtp(email, newOtp, expiresAt);
            yield (0, OtpServices_1.sendOtpEmail)(email, newOtp);
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield this._otpRepository.findByEmail(email);
            if (!record)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NO_OTP_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (record.otp !== otp || record.expiresAt < new Date())
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.OTP_INVALID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            if (!record.tempUserData)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEMP_USER_DATA_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const { name, password } = record.tempUserData;
            const teacher = yield this._teacherRepo.create({ name, email, password, isVerified: true, isBlocked: false });
            yield this._otpRepository.deleteByEmail(email);
            const teacherId = teacher === null || teacher === void 0 ? void 0 : teacher._id.toString();
            const token = (0, JWTtoken_1.generateAccessToken)(teacherId, 'Teacher');
            const refreshToken = (0, JWTtoken_1.generateRefreshToken)(teacherId, 'Teacher');
            return { token, refreshToken, user: { id: teacherId, role: 'Teacher', email: teacher.email, name: teacher.name } };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const teacher = yield this._teacherRepo.findByEmail(email);
            if (!teacher)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_CREDENTIALS, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            if (teacher.password && !(yield bcryptjs_1.default.compare(password, teacher.password)))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_CREDENTIALS, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            if (!teacher.isVerified)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_VERIFIED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            if (teacher.isBlocked)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ACCOUNT_BLOCKED, HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            const teacherId = teacher === null || teacher === void 0 ? void 0 : teacher._id.toString();
            const token = (0, JWTtoken_1.generateAccessToken)(teacherId, 'Teacher');
            const refreshToken = (0, JWTtoken_1.generateRefreshToken)(teacherId, 'Teacher');
            return { token, refreshToken, user: { id: teacherId, role: 'Teacher', email: teacher.email, name: teacher.name } };
        });
    }
    // async googleAuth(profile: GooglePayLoad) {
    //   if (!profile.email || !profile.googleId) throwError(MESSAGES.INVALID_GOOGLE_DATA, STATUS_CODES.BAD_REQUEST);
    //   let user = await this._teacherRepo.findOne({ email: profile.email });
    //   if (!user) {
    //     user = await this._teacherRepo.create({
    //       name: profile.username, email: profile.email, googleId: profile.googleId, profilePicture: profile.image,
    //       role: "Teacher", googleUser: true, isVerified: true
    //     });
    //   } else if (!user.googleUser) {
    //     user = await this._teacherRepo.updateById(user.id, {
    //       name: profile.username, email: profile.email, googleId: profile.googleId, role: "Teacher", googleUser: true, isVerified: true
    //     });
    //   }
    //   if (user.isBlocked) throwError(MESSAGES.ACCOUNT_BLOCKED, STATUS_CODES.FORBIDDEN);
    //   const token = generateAccessToken(user.id, user.role);
    //   const refreshToken = generateRefreshToken(user.id, user.role);
    //   return { token, refreshToken, user: { id: user.id, role: user.role } };
    // }
    // async handleGoogleSignup(idToken: string) {
    //   const profile = await verifyGoogleIdToken(idToken);
    //   const { token, user } = await this._googleAuth(profile);
    //   return { user, token };
    // }
    sendForgotPasswordOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const teacher = yield this._teacherRepo.findByEmail(email);
            if (!teacher)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const otp = (0, OtpServices_1.generateOtp)();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            const existingOtp = yield this._otpRepository.findByEmail(email);
            existingOtp
                ? yield this._otpRepository.updateOtp(email, otp, expiresAt, 'forgot-password')
                : yield this._otpRepository.create({ email, otp, expiresAt, purpose: 'forgot-password' });
            yield (0, OtpServices_1.sendOtpEmail)(email, otp);
        });
    }
    verifyForgotOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield this._otpRepository.findByEmail(email);
            if (!record || record.purpose !== 'forgot-password')
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NO_OTP_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (record.otp !== otp || record.expiresAt < new Date())
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.OTP_INVALID, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
        });
    }
    setNewPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const teacher = yield this._teacherRepo.findByEmail(email);
            if (!teacher)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            yield this._teacherRepo.updateByEmail(email, { password: hashedPassword });
            yield this._otpRepository.deleteByEmail(email);
        });
    }
};
exports.TeacherAuthService = TeacherAuthService;
exports.TeacherAuthService = TeacherAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TeacherRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.OtpRepository)),
    __metadata("design:paramtypes", [Object, Object])
], TeacherAuthService);
