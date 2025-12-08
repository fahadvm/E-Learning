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
exports.CompanyProfileService = void 0;
const inversify_1 = require("inversify");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResANDError_1 = require("../../utils/ResANDError");
const types_1 = require("../../core/di/types");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const OtpServices_1 = require("../../utils/OtpServices");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// In-memory OTP storage for email change
const emailOtpStore = new Map();
let CompanyProfileService = class CompanyProfileService {
    constructor(_companyRepository) {
        this._companyRepository = _companyRepository;
    }
    // Helper for Cloudinary upload
    uploadToCloudinary(file_1, folder_1) {
        return __awaiter(this, arguments, void 0, function* (file, folder, resourceType = 'auto') {
            return new Promise((resolve, reject) => {
                cloudinary_1.default.uploader.upload_stream({ resource_type: resourceType, folder }, (error, result) => {
                    if (error || !result)
                        reject(error || new Error('Upload failed'));
                    else
                        resolve(result.secure_url);
                }).end(file.buffer);
            });
        });
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this._companyRepository.findById(id);
            if (!company)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return company;
        });
    }
    updateProfile(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._companyRepository.updateById(id, data);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return updated;
        });
    }
    requestVerification(companyId, name, address, pincode, phone, certificateFile, taxIdFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this._companyRepository.findById(companyId);
            if (!existing) {
                (0, ResANDError_1.throwError)("Company not found", HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            }
            if (existing.status === "pending") {
                (0, ResANDError_1.throwError)("Verification already submitted", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const certificateUrl = yield this.uploadToCloudinary(certificateFile, "company/certificates");
            const taxIdUrl = yield this.uploadToCloudinary(taxIdFile, "company/taxIds");
            const updateData = {
                name,
                address,
                pincode,
                phone,
                status: "pending",
                isVerified: false,
                registrationDocs: {
                    certificate: certificateUrl,
                    taxId: taxIdUrl
                }
            };
            const updated = yield this._companyRepository.updateById(companyId, updateData);
            return updated;
        });
    }
    // Email Change with OTP
    sendEmailChangeOTP(companyId, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if company exists
            const company = yield this._companyRepository.findById(companyId);
            if (!company)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            // Check if new email is already in use
            const existingCompany = yield this._companyRepository.findByEmail(newEmail);
            if (existingCompany && existingCompany._id.toString() !== companyId) {
                (0, ResANDError_1.throwError)("Email already in use", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Check rate limiting (1 OTP per minute)
            const existing = emailOtpStore.get(companyId);
            if (existing && Date.now() - existing.createdAt < 60000) {
                (0, ResANDError_1.throwError)("Please wait 1 minute before requesting another OTP", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Generate OTP
            const otp = (0, OtpServices_1.generateOtp)(6);
            // Store OTP (expires in 5 minutes)
            emailOtpStore.set(companyId, {
                otp,
                newEmail,
                companyId,
                createdAt: Date.now(),
                attempts: 0
            });
            // Send OTP email
            yield (0, OtpServices_1.sendOtpEmail)(newEmail, otp);
            // Clean up expired OTPs
            setTimeout(() => {
                const stored = emailOtpStore.get(companyId);
                if (stored && Date.now() - stored.createdAt >= 300000) {
                    emailOtpStore.delete(companyId);
                }
            }, 300000); // 5 minutes
        });
    }
    verifyEmailChangeOTP(companyId, newEmail, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const stored = emailOtpStore.get(companyId);
            if (!stored) {
                (0, ResANDError_1.throwError)("OTP expired or not found. Please request a new one.", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Check if OTP expired (5 minutes)
            if (Date.now() - stored.createdAt > 300000) {
                emailOtpStore.delete(companyId);
                (0, ResANDError_1.throwError)("OTP expired. Please request a new one.", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Check attempts (max 3)
            if (stored.attempts >= 3) {
                emailOtpStore.delete(companyId);
                (0, ResANDError_1.throwError)("Too many failed attempts. Please request a new OTP.", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Verify OTP
            if (stored.otp !== otp || stored.newEmail !== newEmail) {
                stored.attempts++;
                (0, ResANDError_1.throwError)("Invalid OTP", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Update email
            const updated = yield this._companyRepository.updateById(companyId, { email: newEmail });
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            // Clear OTP
            emailOtpStore.delete(companyId);
            return updated;
        });
    }
    // Password Change
    changePassword(companyId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this._companyRepository.findById(companyId);
            if (!company)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPANY_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            // Verify current password
            if (!company.password) {
                (0, ResANDError_1.throwError)("Password not set for this account", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const isMatch = yield bcryptjs_1.default.compare(currentPassword, company.password);
            if (!isMatch) {
                (0, ResANDError_1.throwError)("Current password is incorrect", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Validate new password
            if (newPassword.length < 6) {
                (0, ResANDError_1.throwError)("New password must be at least 6 characters long", HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Hash new password
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            // Update password
            yield this._companyRepository.updateById(companyId, { password: hashedPassword });
        });
    }
};
exports.CompanyProfileService = CompanyProfileService;
exports.CompanyProfileService = CompanyProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyRepository)),
    __metadata("design:paramtypes", [Object])
], CompanyProfileService);
