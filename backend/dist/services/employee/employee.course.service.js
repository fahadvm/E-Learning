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
exports.EmployeeCourseService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const leaderboard_1 = require("../../utils/redis/leaderboard");
let EmployeeCourseService = class EmployeeCourseService {
    constructor(_employeeRepo, _companyOrderRepo, _courseRepo, _resourceRepository, _LearnigPathRepo) {
        this._employeeRepo = _employeeRepo;
        this._companyOrderRepo = _companyOrderRepo;
        this._courseRepo = _courseRepo;
        this._resourceRepository = _resourceRepository;
        this._LearnigPathRepo = _LearnigPathRepo;
    }
    getMyCourses(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this._employeeRepo.findById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (!employee.companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_PART_OF_COMPANY, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            const orders = yield this._employeeRepo.getAssignedCourses(employeeId);
            if (!orders)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ORDER_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return orders;
        });
    }
    getMyCourseDetails(employeeId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this._employeeRepo.findById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (!employee.companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_PART_OF_COMPANY, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            if (!courseId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_ID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const orders = yield this._companyOrderRepo.getOrdersById(employee.companyId.toString());
            const purchasedCourseIds = orders.flatMap(order => order.purchasedCourses.map(c => c.courseId._id.toString()));
            if (!purchasedCourseIds.includes(courseId))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const course = yield this._courseRepo.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const progress = yield this._employeeRepo.getOrCreateCourseProgress(employeeId, courseId);
            return { course, progress };
        });
    }
    markLessonComplete(employeeId, courseId, lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepo.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const progress = yield this._employeeRepo.updateEmployeeProgress(employeeId, courseId, lessonId);
            const learningPath = yield this._LearnigPathRepo.updateLearningPathProgress(employeeId, courseId, progress.percentage);
            return progress;
        });
    }
    addLearningTime(employeeId, courseId, seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const course = yield this._courseRepo.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const today = new Date();
            const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const minutes = seconds / 60;
            const record = yield this._employeeRepo.updateLearningTime(employeeId, courseId, date, minutes);
            const employee = yield this._employeeRepo.findById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const companyId = (_a = employee === null || employee === void 0 ? void 0 : employee.companyId) === null || _a === void 0 ? void 0 : _a.toString();
            if (companyId) {
                const completedCourses = ((_b = employee.coursesProgress) === null || _b === void 0 ? void 0 : _b.filter(c => c.percentage === 100).length) || 0;
                const streakCount = employee.streakCount || 0;
                const totalMinutes = yield this._employeeRepo.getTotalMinutes(employeeId, companyId);
                yield (0, leaderboard_1.updateCompanyLeaderboard)(companyId, employeeId, totalMinutes, completedCourses, streakCount);
            }
            return record;
        });
    }
    saveNotes(employeeId, courseId, notes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!notes)
                notes = '// Write your thoughts or doubts here';
            if (!courseId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const course = yield this._courseRepo.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const saving = yield this._employeeRepo.saveNotes(employeeId, courseId, notes);
            return saving;
        });
    }
    getResources(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._resourceRepository.getResourcesByCourse(courseId);
        });
    }
    getProgress(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._employeeRepo.getProgress(employeeId);
        });
    }
    getLearningRecords(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._employeeRepo.getLearningRecords(employeeId);
        });
    }
};
exports.EmployeeCourseService = EmployeeCourseService;
exports.EmployeeCourseService = EmployeeCourseService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.EmployeeRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CompanyOrderRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.CourseResourceRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.EmployeeLearningPathProgressRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], EmployeeCourseService);
