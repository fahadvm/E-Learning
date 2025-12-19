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
exports.AdminStudentController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const validatePagination_1 = require("../../utils/validatePagination");
const socket_1 = require("../../config/socket");
let AdminStudentController = class AdminStudentController {
    constructor(_studentService) {
        this._studentService = _studentService;
    }
    getAllStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = '1', limit = '10', search = '', status = 'all' } = req.query;
            const { pageNum, limitNum, error } = (0, validatePagination_1.validatePagination)(String(page), String(limit));
            if (error)
                return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST, error, false);
            const data = yield this._studentService.getAllStudents(Number(pageNum), Number(limitNum), String(search), String(status));
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.STUDENTS_FETCHED, true, data);
        });
    }
    getStudentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { studentId } = req.params;
            const result = yield this._studentService.getStudentById(studentId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.STUDENT_DETAILS_FETCHED, true, result);
        });
    }
    blockStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { studentId } = req.params;
            const student = yield this._studentService.blockStudent(studentId);
            // Real-time logout trigger
            (0, socket_1.emitToUser)(studentId, 'accountBlocked', {
                message: 'Your account has been blocked by the admin. You will be logged out shortly.'
            });
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.STUDENT_BLOCKED, true, student);
        });
    }
    unblockStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { studentId } = req.params;
            const student = yield this._studentService.unblockStudent(studentId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.STUDENT_UNBLOCKED, true, student);
        });
    }
};
exports.AdminStudentController = AdminStudentController;
exports.AdminStudentController = AdminStudentController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminStudentService)),
    __metadata("design:paramtypes", [Object])
], AdminStudentController);
