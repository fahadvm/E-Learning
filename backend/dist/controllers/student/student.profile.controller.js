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
exports.StudentProfileController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const JWTtoken_1 = require("../../utils/JWTtoken");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let StudentProfileController = class StudentProfileController {
    constructor(_studentProfileService) {
        this._studentProfileService = _studentProfileService;
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, JWTtoken_1.decodeToken)(req.cookies.token);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const student = yield this._studentProfileService.getProfile(decoded.id);
            if (!student)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.STUDENT_DETAILS_FETCHED, true, student);
        });
        this.editProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, JWTtoken_1.decodeToken)(req.cookies.token);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const updated = yield this._studentProfileService.updateStudentProfile(decoded.id, req.body);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.PROFILE_UPDATED, true, updated);
        });
        this.getContributions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { leetcode, github } = req.params;
            if (!leetcode || !github)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_DATA, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const contributions = yield this._studentProfileService.getContributions(leetcode, github);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.CONTRIBUTIONS_FETCHED, true, contributions);
        });
    }
};
exports.StudentProfileController = StudentProfileController;
exports.StudentProfileController = StudentProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentProfileService)),
    __metadata("design:paramtypes", [Object])
], StudentProfileController);
