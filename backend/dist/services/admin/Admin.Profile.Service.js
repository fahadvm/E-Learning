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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProfileService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const bcrypt_1 = __importDefault(require("bcrypt"));
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const OtpServices_1 = require("../../utils/OtpServices");
let AdminProfileService = class AdminProfileService {
    constructor(_adminRepo, _otpRepo) {
        this._adminRepo = _adminRepo;
        this._otpRepo = _otpRepo;
    }
    getProfile(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this._adminRepo.findById(adminId);
            if (!admin)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ADMIN_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return admin;
        });
    }
    updateProfile(adminId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowedFields = ['name', 'phone', 'bio'];
            const filteredUpdates = {};
            for (const key of allowedFields) {
                if (updates[key] !== undefined) {
                    filteredUpdates[key] = updates[key];
                }
            }
            if (Object.keys(filteredUpdates).length === 0) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.PROFILE_UPDATE_FAILED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const updatedAdmin = yield this._adminRepo.update(adminId, filteredUpdates);
            if (!updatedAdmin)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.PROFILE_UPDATE_FAILED);
            return updatedAdmin;
        });
    }
    changePassword(adminId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this._adminRepo.findById(adminId);
            if (!admin)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ADMIN_NOT_FOUND);
            const isMatch = yield bcrypt_1.default.compare(currentPassword, admin.password);
            if (!isMatch)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.PASSWORD_INCORRECT, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            if (currentPassword === newPassword) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NEW_PASSWORD_SAME_AS_OLD, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Validate password strength
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                (0, ResANDError_1.throwError)('Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            yield this._adminRepo.updatePassword(adminId, hashedPassword);
        });
    }
    requestEmailChange(adminId, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if new email is already in use
            const existingAdmin = yield this._adminRepo.findByEmail(newEmail);
            if (existingAdmin) {
                (0, ResANDError_1.throwError)('Email already in use', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Generate and send OTP
            const otp = (0, OtpServices_1.generateOtp)(6);
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
            // Delete any existing OTP for this email
            yield this._otpRepo.deleteByEmail(newEmail, 'change-email');
            // Create new OTP
            yield this._otpRepo.create({
                email: newEmail,
                otp,
                expiresAt,
                purpose: 'change-email'
            });
            // Send OTP email
            yield (0, OtpServices_1.sendOtpEmail)(newEmail, otp);
        });
    }
    verifyEmailChangeOtp(adminId, newEmail, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find OTP
            const otpRecord = yield this._otpRepo.findByEmail(newEmail, 'change-email');
            if (!otpRecord) {
                (0, ResANDError_1.throwError)('OTP not found or expired', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            if (otpRecord.otp !== otp) {
                (0, ResANDError_1.throwError)('Invalid OTP', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Check if email is still available
            const existingAdmin = yield this._adminRepo.findByEmail(newEmail);
            if (existingAdmin) {
                (0, ResANDError_1.throwError)('Email already in use', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Update email
            yield this._adminRepo.updateEmail(adminId, newEmail);
            // Delete OTP after successful verification
            yield this._otpRepo.deleteByEmail(newEmail, 'change-email');
        });
    }
    addNewAdmin(requestingAdminId, email, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if requesting admin is super admin
            const requestingAdmin = yield this._adminRepo.findById(requestingAdminId);
            if (!requestingAdmin || !requestingAdmin.isSuperAdmin) {
                (0, ResANDError_1.throwError)('Only super admins can add new admins', HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            }
            // Check if email already exists
            const existingAdmin = yield this._adminRepo.findByEmail(email);
            if (existingAdmin) {
                (0, ResANDError_1.throwError)('Admin with this email already exists', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Validate password strength
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                (0, ResANDError_1.throwError)('Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Hash password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Create new admin
            const newAdmin = yield this._adminRepo.create({
                email,
                password: hashedPassword,
                name: name || '',
                role: 'admin',
                isSuperAdmin: false
            });
            // Send welcome email (optional - you can implement this)
            // await sendWelcomeEmail(email, password);
            // Return admin without password
            const { password: _ } = newAdmin, adminWithoutPassword = __rest(newAdmin, ["password"]);
            return adminWithoutPassword;
        });
    }
};
exports.AdminProfileService = AdminProfileService;
exports.AdminProfileService = AdminProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.OtpRepository)),
    __metadata("design:paramtypes", [Object, Object])
], AdminProfileService);
