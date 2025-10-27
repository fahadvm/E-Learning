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
exports.StudentCourseService = void 0;
// src/services/student/student.course.service.ts
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const Student_course_Dto_1 = require("../../core/dtos/student/Student.course.Dto");
let StudentCourseService = class StudentCourseService {
    constructor(_courseRepo, _resourceRepository, _studentRepo) {
        this._courseRepo = _courseRepo;
        this._resourceRepository = _resourceRepository;
        this._studentRepo = _studentRepo;
    }
    getAllCourses(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, category, level, language, sort, order, page, limit } = filters;
            const query = {};
            if (search)
                query.title = { $regex: search, $options: 'i' };
            if (category)
                query.category = category;
            if (level)
                query.level = level;
            if (language)
                query.language = language;
            const skip = (page - 1) * limit;
            const sortQuery = {
                [sort]: order === 'asc' ? 1 : -1
            };
            const courses = yield this._courseRepo.findAllCourses(query, sortQuery, skip, limit);
            const total = yield this._courseRepo.countAllCourses(query);
            const totalPages = Math.ceil(total / limit);
            return {
                data: courses.map(Student_course_Dto_1.StudentCourseDTO),
                total,
                totalPages,
            };
        });
    }
    ;
    getCourseDetail(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!courseId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_ID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const course = yield this._courseRepo.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return course;
        });
    }
    markLessonComplete(studentId, courseId, lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepo.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const progress = yield this._studentRepo.updateStudentProgress(studentId, courseId, lessonId);
            return progress;
        });
    }
    saveNotes(studentId, courseId, notes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!notes)
                notes = '// Write your thoughts or doubts here';
            if (!courseId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const course = yield this._courseRepo.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const saving = yield this._studentRepo.saveNotes(studentId, courseId, notes);
            return saving;
        });
    }
    getResources(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._resourceRepository.getResourcesByCourse(courseId);
        });
    }
};
exports.StudentCourseService = StudentCourseService;
exports.StudentCourseService = StudentCourseService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CourseResourceRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.StudentRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], StudentCourseService);
