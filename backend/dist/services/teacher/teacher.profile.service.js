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
exports.TeacherProfileService = void 0;
// application/services/TeacherProfileService.ts
const inversify_1 = require("inversify");
const Teacher_1 = require("../../models/Teacher");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const types_1 = require("../../core/di/types");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
let TeacherProfileService = class TeacherProfileService {
    constructor(_teacherRepository) {
        this._teacherRepository = _teacherRepository;
    }
    createProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.email)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMAIL_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const existing = yield this._teacherRepository.findByEmail(data.email);
            if (existing)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_ALREADY_EXISTS, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            return yield this._teacherRepository.create(data);
        });
    }
    updateProfile(teacherId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._teacherRepository.updateById(teacherId, data);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return updated;
        });
    }
    getProfile(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const teacher = yield this._teacherRepository.findById(teacherId);
            if (!teacher)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return teacher;
        });
    }
    sendVerificationRequest(teacherId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const teacher = yield this._teacherRepository.findById(teacherId);
            if (!teacher)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (teacher.verificationStatus === Teacher_1.VerificationStatus.VERIFIED)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ALREADY_VERIFIED, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            if (teacher.verificationStatus === Teacher_1.VerificationStatus.PENDING)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ALREADY_REQUESTED_VERIFICATION, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            const isComplete = yield this._teacherRepository.isProfileComplete(teacherId);
            if (!isComplete)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COMPLETE_PROFILE, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            console.log('until here everything fine', file);
            const uploadResult = yield cloudinary_1.default.uploader.upload(file.path, {
                folder: 'teacher_resumes',
                resource_type: 'auto',
                use_filename: true,
            });
            console.log('uploadResult', uploadResult);
            const resumeUrl = uploadResult.secure_url;
            const updated = yield this._teacherRepository.sendVerificationRequest(teacherId, Teacher_1.VerificationStatus.PENDING, resumeUrl);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.VERIFICATION_FAILED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            return updated;
        });
    }
};
exports.TeacherProfileService = TeacherProfileService;
exports.TeacherProfileService = TeacherProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TeacherRepository)),
    __metadata("design:paramtypes", [Object])
], TeacherProfileService);
