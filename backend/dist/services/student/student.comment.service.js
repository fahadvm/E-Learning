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
exports.StudentCommentService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let StudentCommentService = class StudentCommentService {
    constructor(_commentRepo) {
        this._commentRepo = _commentRepo;
    }
    addComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._commentRepo.addComment(data);
        });
    }
    getComments(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._commentRepo.getCommentsByCourse(courseId);
        });
    }
    getReplies(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._commentRepo.getReplies(parentId);
        });
    }
    deleteComment(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this._commentRepo.findById(commentId);
            if (!comment)
                (0, ResANDError_1.throwError)('Comment not found', HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            // Permission check: only owner can delete
            if (comment.userId.toString() !== userId) {
                (0, ResANDError_1.throwError)('Unauthorized to delete this comment', HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            }
            return this._commentRepo.deleteComment(commentId);
        });
    }
    toggleLike(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._commentRepo.toggleLike(commentId, userId);
        });
    }
    toggleDislike(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._commentRepo.toggleDislike(commentId, userId);
        });
    }
};
exports.StudentCommentService = StudentCommentService;
exports.StudentCommentService = StudentCommentService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CommentRepository)),
    __metadata("design:paramtypes", [Object])
], StudentCommentService);
