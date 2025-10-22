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
exports.StudentWishlistController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let StudentWishlistController = class StudentWishlistController {
    constructor(_wishlistService) {
        this._wishlistService = _wishlistService;
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { courseId } = req.body;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const result = yield this._wishlistService.addCourse(studentId, courseId);
            if (result)
                return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.WISHLIST_COURSE_ADDED, true, result);
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const result = yield this._wishlistService.listWishlist(studentId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.WISHLIST_FETCHED, true, result);
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { courseId } = req.params;
            const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!studentId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const result = yield this._wishlistService.removeCourse(studentId, courseId);
            return (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.WISHLIST_COURSE_REMOVED, true, result);
        });
    }
};
exports.StudentWishlistController = StudentWishlistController;
exports.StudentWishlistController = StudentWishlistController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentWishlistService)),
    __metadata("design:paramtypes", [Object])
], StudentWishlistController);
