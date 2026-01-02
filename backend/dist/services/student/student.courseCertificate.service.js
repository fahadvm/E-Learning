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
exports.StudentCourseCertificateService = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const generateCertificatePDF_1 = require("../../utils/generateCertificatePDF");
const uploadPDF_1 = require("../../utils/uploadPDF");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let StudentCourseCertificateService = class StudentCourseCertificateService {
    constructor(_certRepo, _courseRepo, _studentRepo) {
        this._certRepo = _certRepo;
        this._courseRepo = _courseRepo;
        this._studentRepo = _studentRepo;
    }
    generateCourseCertificate(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepo.findById(studentId);
            const course = yield this._courseRepo.findById(courseId);
            if (!student || !course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_DATA);
            const already = yield this._certRepo.findByStudentCourse(studentId, courseId);
            if (already)
                return already;
            const certNumber = 'COURSE-CERT-' + Date.now();
            const pdfBuffer = yield (0, generateCertificatePDF_1.generateCertificatePDF)({
                studentName: student.name,
                courseName: course.title,
                certificateNumber: certNumber,
            });
            const certificateUrl = yield (0, uploadPDF_1.uploadPDFtoCloudinary)(pdfBuffer);
            return yield this._certRepo.create({
                studentId: new mongoose_1.Types.ObjectId(studentId),
                courseId: new mongoose_1.Types.ObjectId(courseId),
                certificateUrl,
                certificateNumber: certNumber,
            });
        });
    }
    getMyCourseCertificates(studentId, page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._certRepo.findByStudent(studentId, page, limit, search);
        });
    }
    getCourseCertificate(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const certificate = yield this._certRepo.findOneByCourseId(studentId, courseId);
            if (!certificate)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ACCOUNT_BLOCKED, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return certificate;
        });
    }
};
exports.StudentCourseCertificateService = StudentCourseCertificateService;
exports.StudentCourseCertificateService = StudentCourseCertificateService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CourseCertificateRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.StudentRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], StudentCourseCertificateService);
