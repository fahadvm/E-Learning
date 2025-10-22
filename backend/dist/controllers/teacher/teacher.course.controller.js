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
exports.TeacherCourseController = void 0;
const inversify_1 = require("inversify");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResANDError_1 = require("../../utils/ResANDError");
const ResANDError_2 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const types_1 = require("../../core/di/types");
let TeacherCourseController = class TeacherCourseController {
    constructor(_courseService) {
        this._courseService = _courseService;
    }
    addCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield this._courseService.createCourse(req);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.CREATED, ResponseMessages_1.MESSAGES.COURSE_CREATED, true, created);
        });
    }
    getMyCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const teacherId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!teacherId)
                (0, ResANDError_2.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const courses = yield this._courseService.getCoursesByTeacherId(teacherId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSES_FETCHED, true, courses);
        });
    }
    getCourseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { courseId } = req.params;
            const teacherId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!teacherId)
                (0, ResANDError_2.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const courseDetails = yield this._courseService.getCourseByIdWithTeacherId(courseId, teacherId);
            if (!courseDetails)
                (0, ResANDError_2.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSE_DETAILS_FETCHED, true, courseDetails);
        });
    }
    uploadResource(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            const { title } = req.body;
            const file = req.file;
            console.log('file is ', file);
            if (!file)
                return (0, ResANDError_2.throwError)(ResponseMessages_1.MESSAGES.FILE_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const resource = yield this._courseService.uploadResource(courseId, title, file);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.RESOURCE_UPLOADED, true, resource);
        });
    }
    deleteResource(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { resourceId } = req.params;
            if (!resourceId)
                (0, ResANDError_2.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const deleted = yield this._courseService.deleteResource(resourceId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.RESOURCE_DELETED, true, deleted);
        });
    }
    getResources(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            const resources = yield this._courseService.getResources(courseId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.RESOURCES_FETCHED, true, resources);
        });
    }
};
exports.TeacherCourseController = TeacherCourseController;
exports.TeacherCourseController = TeacherCourseController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TeacherCourseService)),
    __metadata("design:paramtypes", [Object])
], TeacherCourseController);
