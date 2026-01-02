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
exports.CompanyCourseService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const mongoose_1 = __importDefault(require("mongoose"));
let CompanyCourseService = class CompanyCourseService {
    constructor(_courseRepository, _companyOrderRepository, _purchasedRepository, _employeeRepo, _resourceRepository) {
        this._courseRepository = _courseRepository;
        this._companyOrderRepository = _companyOrderRepository;
        this._purchasedRepository = _purchasedRepository;
        this._employeeRepo = _employeeRepo;
        this._resourceRepository = _resourceRepository;
    }
    getAllCourses(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this._courseRepository.getFilteredCourses(Object.assign(Object.assign({}, filters), { isBlocked: false }));
            return courses;
        });
    }
    getCourseDetail(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepository.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return course;
        });
    }
    assignCourseToEmployee(courseId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this._employeeRepo.findById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND);
            const course = yield this._courseRepository.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND);
            if (course.isBlocked) {
                (0, ResANDError_1.throwError)('This course is blocked by admin and cannot be assigned to employees.', HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            }
            return yield this._employeeRepo.assignCourseToEmployee(courseId, employeeId);
        });
    }
    getMycoursesById(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyIdObj = new mongoose_1.default.Types.ObjectId(companyId);
            const orders = yield this._purchasedRepository.getAllPurchasesByCompany(companyIdObj);
            return orders;
        });
    }
    getMycourseDetailsById(companyId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!courseId || !companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_ID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const orders = yield this._companyOrderRepository.getOrdersByCompanyId(companyId);
            const purchasedCourseIds = orders.flatMap((order) => order.purchasedCourses.map((c) => c.courseId.toString()));
            if (!purchasedCourseIds.includes(courseId)) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            }
            const course = yield this._courseRepository.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (course.isBlocked) {
                (0, ResANDError_1.throwError)('Access to this course has been disabled by admin. Reason: ' + (course.blockReason || 'No reason provided'), HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            }
            return course;
        });
    }
    getResources(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepository.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (course.isBlocked) {
                (0, ResANDError_1.throwError)('Course resources are unavailable as the course is blocked by admin.', HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            }
            return this._resourceRepository.getResourcesByCourse(courseId);
        });
    }
};
exports.CompanyCourseService = CompanyCourseService;
exports.CompanyCourseService = CompanyCourseService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CompanyOrderRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CompanyCoursePurchaseRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.EmployeeRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.CourseResourceRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CompanyCourseService);
