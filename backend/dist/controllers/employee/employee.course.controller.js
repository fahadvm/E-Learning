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
exports.EmployeeCourseController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
let EmployeeCourseController = class EmployeeCourseController {
    constructor(_employeeCourseService) {
        this._employeeCourseService = _employeeCourseService;
        this.markLessonComplete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const employeeId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { courseId, lessonIndex } = req.params;
            if (!employeeId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            if (!lessonIndex)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.LESSON_ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const result = yield this._employeeCourseService.markLessonComplete(employeeId, courseId, lessonIndex);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COMPLETD_LESSON_MARKED, true, result);
        });
        this.trackLearningTime = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const employeeId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { courseId, seconds } = req.body;
            if (!employeeId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const result = yield this._employeeCourseService.addLearningTime(employeeId, courseId, seconds);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LEARNING_TIME_TRACKED, true, result);
        });
        this.codecompiler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const JUDGE0_URL = process.env.JUDGE0_URL;
            const { language, code } = req.body;
            if (!language || !code)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.LANGUAGE_AND_CODE_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const languageMap = {
                python: 71,
                javascript: 63,
                cpp: 54,
                java: 62,
                c: 50,
                csharp: 51,
                php: 68,
                go: 60,
                ruby: 72,
                sql: 82,
            };
            const languageId = languageMap[language.toLowerCase()];
            if (!languageId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNSUPPORTED_LANGUAGE, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            const response = yield axios_1.default.post(JUDGE0_URL, { source_code: code, language_id: languageId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': process.env.JUDGE0_API_KEY ||
                        '0d5115fdbcmsh30c67d2f61ef3e7p142104jsn296e045ea6a4',
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                },
            });
            const output = response.data.stdout || response.data.stderr || 'No output';
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.CODE_RUN_SUCCESSFULLY, true, output);
        });
        this.noteSaving = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const employeeId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { courseId, notes } = req.body;
            if (!employeeId || !courseId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const saving = yield this._employeeCourseService.saveNotes(employeeId, courseId, notes);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.NOTE_SAVED_SUCCESSFULLY, true, saving);
        });
        this.getCourseResources = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            if (!courseId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const resources = yield this._employeeCourseService.getResources(courseId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.RESOURCES_FETCHED, true, resources);
        });
    }
    myCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const employeeId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!employeeId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_ID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const courses = yield this._employeeCourseService.getMyCourses(employeeId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSES_FETCHED, true, courses);
        });
    }
    myCourseDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const employeeId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!employeeId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_ID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const { courseId } = req.params;
            const course = yield this._employeeCourseService.getMyCourseDetails(employeeId, courseId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSES_FETCHED, true, course);
        });
    }
    getLearningRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const employeeId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!employeeId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const data = yield this._employeeCourseService.getLearningRecords(employeeId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LEARNING_RECORD_FETCHED, true, data);
        });
    }
    getCourseProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const employeeId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!employeeId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const data = yield this._employeeCourseService.getProgress(employeeId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PROGRESS_FETCHED, true, data);
        });
    }
};
exports.EmployeeCourseController = EmployeeCourseController;
exports.EmployeeCourseController = EmployeeCourseController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.EmployeeCourseService)),
    __metadata("design:paramtypes", [Object])
], EmployeeCourseController);
