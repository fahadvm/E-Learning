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
exports.AdminTeacherService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const Admin_teacher_Dto_1 = require("../../core/dtos/admin/Admin.teacher.Dto");
const Admin_course_Dto_1 = require("../../core/dtos/admin/Admin.course.Dto");
let AdminTeacherService = class AdminTeacherService {
    constructor(_teacherRepo, _courseRepo) {
        this._teacherRepo = _teacherRepo;
        this._courseRepo = _courseRepo;
    }
    getAllTeachers(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const teachers = yield this._teacherRepo.findAll({ skip, limit, search });
            const total = yield this._teacherRepo.count(search);
            const totalPages = Math.ceil(total / limit);
            return {
                data: teachers.map(Admin_teacher_Dto_1.adminTeacherDto),
                total,
                totalPages
            };
        });
    }
    getUnverifiedTeachers() {
        return __awaiter(this, void 0, void 0, function* () {
            const teachers = yield this._teacherRepo.findUnverified();
            if (!teachers)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return teachers.map(Admin_teacher_Dto_1.adminTeacherDto);
        });
    }
    verifyTeacher(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._teacherRepo.updateStatus(teacherId, { isVerified: true, isRejected: false });
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Admin_teacher_Dto_1.adminTeacherDto)(updated);
        });
    }
    getTeacherById(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const teacher = yield this._teacherRepo.findById(teacherId);
            if (!teacher)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Admin_teacher_Dto_1.adminTeacherDto)(teacher);
        });
    }
    getTeacherCourses(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const teacher = yield this._teacherRepo.findById(teacherId);
            if (!teacher)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const courses = yield this._courseRepo.findByTeacherId(teacherId);
            return courses.map(Admin_course_Dto_1.AdminCourseDTO);
        });
    }
    rejectTeacher(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._teacherRepo.updateStatus(teacherId, { isVerified: false, isRejected: true });
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Admin_teacher_Dto_1.adminTeacherDto)(updated);
        });
    }
    blockTeacher(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._teacherRepo.updateStatus(teacherId, { isBlocked: true });
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Admin_teacher_Dto_1.adminTeacherDto)(updated);
        });
    }
    unblockTeacher(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._teacherRepo.updateStatus(teacherId, { isBlocked: false });
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TEACHER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Admin_teacher_Dto_1.adminTeacherDto)(updated);
        });
    }
};
exports.AdminTeacherService = AdminTeacherService;
exports.AdminTeacherService = AdminTeacherService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TeacherRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __metadata("design:paramtypes", [Object, Object])
], AdminTeacherService);
