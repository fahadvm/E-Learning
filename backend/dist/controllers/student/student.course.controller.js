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
exports.StudentCourseController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const axios_1 = __importDefault(require("axios"));
let StudentCourseController = class StudentCourseController {
    constructor(_courseService) {
        this._courseService = _courseService;
        this.getAllCourses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { search, category, level, language, sort = 'createdAt', order = 'desc', page = '1', limit = '8' } = req.query;
            const courses = yield this._courseService.getAllCourses({
                search: search,
                category: category,
                level: level,
                language: language,
                sort: sort,
                order: order,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            });
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSES_FETCHED, true, courses);
        });
        this.getCourseDetailById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            if (!courseId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_ID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const course = yield this._courseService.getCourseDetail(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COURSE_DETAILS_FETCHED, true, course);
        });
        this.markLessonComplete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { courseId, lessonIndex } = req.params;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            if (!lessonIndex)
                (0, ResANDError_1.throwError)('Lesson ID is required', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            console.log(studentId, courseId, lessonIndex);
            const result = yield this._courseService.markLessonComplete(studentId, courseId, lessonIndex);
            console.log('here controller will show the final result ', result);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.COMPLETD_LESSON_MARKED, true, result);
        });
        this.codecompiler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('compiler ready to start code runner');
            const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true';
            const { language, code } = req.body;
            if (!language || !code)
                (0, ResANDError_1.throwError)('Language and code are required', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const languageMap = {
                python: 71, // Python 3
                javascript: 63, // Node.js
                cpp: 54, // C++
                java: 62, // Java
                c: 50, // C
                csharp: 51, // C#
                php: 68, // PHP
                go: 60, // Go
                ruby: 72, // Ruby
                sql: 82, // SQL (SQLite)
            };
            const languageId = languageMap[language.toLowerCase()];
            if (!languageId)
                (0, ResANDError_1.throwError)('Unsupported language', HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            const response = yield axios_1.default.post(JUDGE0_URL, {
                source_code: code,
                language_id: languageId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '0d5115fdbcmsh30c67d2f61ef3e7p142104jsn296e045ea6a4',
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                },
            });
            const output = response.data.stdout || response.data.stderr || 'No output';
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.CODE_RUN_SUCCESSFULLY, true, output);
        });
        this.noteSaving = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { courseId, notes } = req.body;
            if (!studentId || !courseId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.REQUIRED_FIELDS_MISSING, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const saving = yield this._courseService.saveNotes(studentId, courseId, notes);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.NOTE_SAVED_SUCCESSFULLY, true, saving);
        });
        this.getCourseResources = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            if (!courseId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const resources = yield this._courseService.getResources(courseId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.RESOURCES_FETCHED, true, resources);
        });
    }
};
exports.StudentCourseController = StudentCourseController;
exports.StudentCourseController = StudentCourseController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentCourseService)),
    __metadata("design:paramtypes", [Object])
], StudentCourseController);
