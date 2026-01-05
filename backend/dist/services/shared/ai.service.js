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
exports.StudentAiTutorService = void 0;
// services/studentAiTutorService.ts
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const generative_ai_1 = require("@google/generative-ai");
const logger_1 = __importDefault(require("../../utils/logger"));
let StudentAiTutorService = class StudentAiTutorService {
    constructor(_courseRepo) {
        this._courseRepo = _courseRepo;
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey)
            throw new Error('Missing Google API key');
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    getCourseAnswer(courseId, prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const course = yield this._courseRepo.findById(courseId);
            if (!course)
                throw new Error('Course not found');
            const systemMessage = `
You are an AI Study Assistant. Answer student questions based on the course: ${course.title}.
Description: ${course.description || 'No description'}
Modules: ${((_a = course.modules) === null || _a === void 0 ? void 0 : _a.map((m) => m.description).join(', ')) || 'No modules'}
    `;
            const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            logger_1.default.debug(`prompt" : ${systemMessage}\n\nUser: ${prompt}`);
            const result = yield model.generateContent(`${systemMessage}\n\nUser: ${prompt}`);
            const response = yield result.response;
            return response.text() || 'Sorry, I could not answer that.';
        });
    }
};
exports.StudentAiTutorService = StudentAiTutorService;
exports.StudentAiTutorService = StudentAiTutorService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __metadata("design:paramtypes", [Object])
], StudentAiTutorService);
