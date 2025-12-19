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
exports.AdminTeacherController = void 0;
// controllers/admin/admin.teacher.controller.ts
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const validatePagination_1 = require("../../utils/validatePagination");
const socket_1 = require("../../config/socket");
let AdminTeacherController = class AdminTeacherController {
    constructor(_teacherService) {
        this._teacherService = _teacherService;
    }
    getAllTeachers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = '1', limit = '10', search = '', status = '' } = req.query;
            const { pageNum, limitNum, error } = (0, validatePagination_1.validatePagination)(String(page), String(limit));
            if (error)
                return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST, error, false);
            const result = yield this._teacherService.getAllTeachers(pageNum, limitNum, String(search || ''), String(status || ''));
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.TEACHERS_FETCHED, true, result);
        });
    }
    getVerificationRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = '1', limit = '10', search = '' } = req.query;
            const { pageNum, limitNum, error } = (0, validatePagination_1.validatePagination)(String(page), String(limit));
            if (error)
                return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST, error, false);
            const result = yield this._teacherService.getVerificationRequests(pageNum, limitNum, String(search || ''));
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.VERIFICATION_REQUESTS_FETCHED, true, result);
        });
    }
    getTeacherById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { teacherId } = req.params;
            const teacher = yield this._teacherService.getTeacherById(teacherId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.TEACHER_DETAILS_FETCHED, true, teacher);
        });
    }
    verifyTeacher(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { teacherId } = req.params;
            const updated = yield this._teacherService.verifyTeacher(teacherId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.VERIFIED, true, updated);
        });
    }
    rejectTeacher(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { teacherId } = req.params;
            const { reason } = req.body;
            const updated = yield this._teacherService.rejectTeacher(teacherId, String(reason || ''));
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.REJECTED, true, updated);
        });
    }
    blockTeacher(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { teacherId } = req.params;
            const updated = yield this._teacherService.blockTeacher(teacherId);
            // Real-time logout trigger
            (0, socket_1.emitToUser)(teacherId, 'accountBlocked', {
                message: 'Your account has been blocked by the admin. You will be logged out shortly.'
            });
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.TEACHER_BLOCKED, true, updated);
        });
    }
    unblockTeacher(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { teacherId } = req.params;
            const updated = yield this._teacherService.unblockTeacher(teacherId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.TEACHER_UNBLOCKED, true, updated);
        });
    }
};
exports.AdminTeacherController = AdminTeacherController;
exports.AdminTeacherController = AdminTeacherController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminTeacherService)),
    __metadata("design:paramtypes", [Object])
], AdminTeacherController);
