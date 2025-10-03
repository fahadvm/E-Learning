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
exports.CompanyCourseService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
let CompanyCourseService = class CompanyCourseService {
    constructor(_courseRepository, _companyOrderRepository) {
        this._courseRepository = _courseRepository;
        this._companyOrderRepository = _companyOrderRepository;
    }
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this._courseRepository.findAllCourses();
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
    getMycoursesById(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("request reached until service ");
            const orders = yield this._companyOrderRepository.getOrdersByCompanyId(companyId);
            return orders;
        });
    }
    getMycourseDetailsById(companyId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!courseId || !companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_ID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const orders = yield this._companyOrderRepository.getOrdersByCompanyId(companyId);
            const purchasedCourseIds = orders.flatMap((order) => order.courses.map((c) => c.toString()));
            if (!purchasedCourseIds.includes(courseId)) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            }
            const course = yield this._courseRepository.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return course;
        });
    }
};
exports.CompanyCourseService = CompanyCourseService;
exports.CompanyCourseService = CompanyCourseService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.CompanyOrderRepository)),
    __metadata("design:paramtypes", [Object, Object])
], CompanyCourseService);
