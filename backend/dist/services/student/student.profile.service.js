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
exports.StudentProfileService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const Student_profile_Dto_1 = require("../../core/dtos/student/Student.profile.Dto");
let StudentProfileService = class StudentProfileService {
    constructor(_studentRepo, _PublicApiRepo) {
        this._studentRepo = _studentRepo;
        this._PublicApiRepo = _PublicApiRepo;
    }
    getProfile(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepo.findById(studentId);
            if (!student)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Student_profile_Dto_1.studentProfileDto)(student);
        });
    }
    updateStudentProfile(studentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._studentRepo.update(studentId, data);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, Student_profile_Dto_1.studentProfileDto)(updated);
        });
    }
    getContributions(leetcodeUsername, githubUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const [github, leetcode] = yield Promise.all([
                this._PublicApiRepo.fetchGitHub(githubUsername),
                this._PublicApiRepo.fetchLeetCodeStats(leetcodeUsername),
            ]);
            const contributions = { github, leetcode };
            return contributions;
        });
    }
};
exports.StudentProfileService = StudentProfileService;
exports.StudentProfileService = StudentProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.PublicApiRepository)),
    __metadata("design:paramtypes", [Object, Object])
], StudentProfileService);
