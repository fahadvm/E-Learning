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
exports.EmployeeAuthService = void 0;
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
let EmployeeAuthService = class EmployeeAuthService {
    constructor(_employeeRepo, _otpRepo) {
        this._employeeRepo = _employeeRepo;
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
            const existingEmployee = yield this._employeeRepo.findByEmail(email);
            if (existingEmployee)
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
            const employee = yield this._employeeRepo.create({
                name,
                email,
                password,
                isVerified: true,
                isBlocked: false
            });
            yield this._otpRepo.deleteByEmail(email);
            const token = (0, JWTtoken_1.generateAccessToken)(employee._id.toString(), 'employee');
            const refreshToken = (0, JWTtoken_1.generateRefreshToken)(employee._id.toString(), 'employee');
            let streak = yield this._employeeRepo.updateLoginStreak(employee._id.toString());
            console.log("streak :", streak);
            if (!streak)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STREAK_FAILED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            return {
                token,
                refreshToken,
                user: { id: employee._id.toString(), role: 'employee', email: employee.email, name: employee.name }
            };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this._employeeRepo.findByEmail(email);
            if (!employee || !employee.password)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_CREDENTIALS, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const match = yield bcryptjs_1.default.compare(password, employee.password);
            if (!match)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_CREDENTIALS, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            if (!employee.isVerified)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.VERIFY_EMAIL, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            if (employee.isBlocked)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ACCOUNT_BLOCKED, HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            const token = (0, JWTtoken_1.generateAccessToken)(employee._id.toString(), 'employee');
            const refreshToken = (0, JWTtoken_1.generateRefreshToken)(employee._id.toString(), 'employee');
            let streak = yield this._employeeRepo.updateLoginStreak(employee._id.toString());
            if (!streak)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STREAK_FAILED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            return {
                token,
                refreshToken,
                user: { id: employee._id.toString(), role: 'employee', email: employee.email, name: employee.name }
            };
        });
    }
    googleAuth(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = yield this._googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
            const payload = ticket.getPayload();
            if (!payload)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.GOOGLE_TOKEN_INVALID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const { sub: googleId, email, name } = payload;
            if (!googleId || !email)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.GOOGLE_TOKEN_MISSING_FIELDS, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            let user = yield this._employeeRepo.findByGoogleId(googleId);
            if (!user)
                user = yield this._employeeRepo.findByEmail(email);
            if (!user) {
                user = yield this._employeeRepo.create({
                    googleId,
                    email,
                    name,
                    isVerified: true,
                    isBlocked: false,
                    role: 'employee'
                });
            }
            else if (!user.googleId) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.USER_NOT_LINKED_GOOGLE, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const token = (0, JWTtoken_1.generateAccessToken)(user._id.toString(), user.role);
            const refreshToken = (0, JWTtoken_1.generateRefreshToken)(user._id.toString(), user.role);
            let streak = yield this._employeeRepo.updateLoginStreak(user._id.toString());
            if (!streak)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STREAK_FAILED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            return {
                token,
                refreshToken,
                user: { id: user._id.toString(), role: 'employee' }
            };
        });
    }
    sendForgotPasswordOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this._employeeRepo.findByEmail(email);
            if (!employee)
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
            const employee = yield this._employeeRepo.findByEmail(email);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            yield this._employeeRepo.updateByEmail(email, { password: hashedPassword });
            yield this._otpRepo.deleteByEmail(email);
        });
    }
    sendChangeEmailOtp(employeeId, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this._employeeRepo.findByEmail(newEmail);
            if (existing)
                (0, ResANDError_1.throwError)("Email already in use.", HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            const otp = (0, OtpServices_1.generateOtp)();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            const existingOtp = yield this._otpRepo.findByEmail(newEmail);
            if (existingOtp)
                yield this._otpRepo.updateOtp(newEmail, otp, expiresAt, "change-email");
            else
                yield this._otpRepo.create({ email: newEmail, otp, expiresAt, purpose: "change-email" });
            yield (0, OtpServices_1.sendOtpEmail)(newEmail, otp);
        });
    }
    verifyChangeEmail(employeeId, newEmail, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield this._otpRepo.findByEmail(newEmail);
            if (!record || record.purpose !== "change-email")
                (0, ResANDError_1.throwError)("OTP not valid", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            if (record.otp !== otp || record.expiresAt < new Date())
                (0, ResANDError_1.throwError)("Invalid OTP", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._employeeRepo.updateById(employeeId, { email: newEmail });
            yield this._otpRepo.deleteByEmail(newEmail);
        });
    }
    changePassword(employeeID, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("change pass word id in service with ", employeeID, oldPassword, newPassword);
            const employee = yield this._employeeRepo.findById(employeeID);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (!employee.password)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const match = yield bcryptjs_1.default.compare(oldPassword, employee.password);
            if (!match)
                (0, ResANDError_1.throwError)("Old password incorrect", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const hashed = yield bcryptjs_1.default.hash(newPassword, 10);
            yield this._employeeRepo.updateById(employeeID, { password: hashed });
        });
    }
};
exports.EmployeeAuthService = EmployeeAuthService;
exports.EmployeeAuthService = EmployeeAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.EmployeeRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.OtpRepository)),
    __metadata("design:paramtypes", [Object, Object])
], EmployeeAuthService);
