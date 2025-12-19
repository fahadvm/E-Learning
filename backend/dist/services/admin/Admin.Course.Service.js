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
exports.AdminCourseService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const Admin_course_Dto_1 = require("../../core/dtos/admin/Admin.course.Dto");
const socket_1 = require("../../config/socket");
const Course_1 = require("../../models/Course");
let AdminCourseService = class AdminCourseService {
    constructor(_courseRepo, _notificationService, _companyRepository) {
        this._courseRepo = _courseRepo;
        this._notificationService = _notificationService;
        this._companyRepository = _companyRepository;
    }
    getAllCourses(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [data, total] = yield Promise.all([
                this._courseRepo.findAll({ skip, limit, search }),
                this._courseRepo.count(search),
            ]);
            const totalPages = Math.ceil(total / limit);
            return { data: data.map(Admin_course_Dto_1.AdminCourseDTO), total, totalPages };
        });
    }
    getUnverifiedCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this._courseRepo.findUnverified();
            return courses.map(Admin_course_Dto_1.AdminCourseDTO);
        });
    }
    getCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepo.findById(courseId);
            return course ? (0, Admin_course_Dto_1.AdminCourseDTO)(course) : null;
        });
    }
    verifyCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepo.updateStatus(courseId, {
                status: Course_1.CourseStatus.APPROVED,
                isVerified: true,
                isPublished: true
            });
            if (course) {
                // Notify Teacher
                if (course.teacherId) {
                    yield this._notificationService.createNotification(typeof course.teacherId === 'string' ? course.teacherId : course.teacherId._id.toString(), 'Course Approved', `Your course "${course.title}" has been approved and published.`, 'course', 'teacher', '/teacher/courses');
                }
                // Notify Companies
                const companies = yield this._companyRepository.findAll();
                for (const company of companies) {
                    yield this._notificationService.createNotification(company._id.toString(), 'New Course Available', `A new course "${course.title}" has been published.`, 'course', 'company', '/company/courses');
                }
            }
            return course ? (0, Admin_course_Dto_1.AdminCourseDTO)(course) : null;
        });
    }
    rejectCourse(courseId, remarks) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepo.updateStatus(courseId, {
                status: Course_1.CourseStatus.REJECTED,
                isVerified: false,
                isPublished: false,
                adminRemarks: remarks
            });
            if (course && course.teacherId) {
                yield this._notificationService.createNotification(typeof course.teacherId === 'string' ? course.teacherId : course.teacherId._id.toString(), 'Course Rejected', `Your course "${course.title}" has been rejected. Remarks: ${remarks}`, 'course', 'teacher', '/teacher/courses');
            }
            return course ? (0, Admin_course_Dto_1.AdminCourseDTO)(course) : null;
        });
    }
    blockCourse(courseId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepo.updateStatus(courseId, { isBlocked: true, blockReason: reason });
            if (course) {
                (0, socket_1.broadcastEvent)('courseBlocked', {
                    courseId,
                    reason,
                    message: 'This course has been blocked by admin.'
                });
            }
            return course ? (0, Admin_course_Dto_1.AdminCourseDTO)(course) : null;
        });
    }
    unblockCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepo.updateStatus(courseId, { isBlocked: false, blockReason: '' });
            if (course) {
                (0, socket_1.broadcastEvent)('courseUnblocked', { courseId });
            }
            return course ? (0, Admin_course_Dto_1.AdminCourseDTO)(course) : null;
        });
    }
};
exports.AdminCourseService = AdminCourseService;
exports.AdminCourseService = AdminCourseService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.NotificationService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CompanyRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminCourseService);
