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
exports.EmployeeCommentController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResANDError_1 = require("../../utils/ResANDError");
const mongoose_1 = require("mongoose");
let EmployeeCommentController = class EmployeeCommentController {
    constructor(_commentService) {
        this._commentService = _commentService;
        this.addComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { content, parentId } = req.body;
            const { courseId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            let userModel = 'Employee';
            if (role === 'teacher')
                userModel = 'Teacher';
            else if (role === 'student')
                userModel = 'Student';
            else if (role === 'company')
                userModel = 'Company';
            const comment = yield this._commentService.addComment({
                courseId: new mongoose_1.Types.ObjectId(courseId),
                userId: new mongoose_1.Types.ObjectId(userId),
                userModel,
                content,
                likes: [],
                dislikes: [],
                parentId: parentId ? new mongoose_1.Types.ObjectId(parentId) : undefined
            });
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, 'Comment added', true, comment);
        });
        this.getComments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            const comments = yield this._commentService.getComments(courseId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, 'Comments fetched', true, comments);
        });
        this.getReplies = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { commentId } = req.params;
            const replies = yield this._commentService.getReplies(commentId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, 'Replies fetched', true, replies);
        });
        this.deleteComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { commentId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const deleted = yield this._commentService.deleteComment(commentId, userId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, 'Comment deleted', true, deleted);
        });
        this.toggleLike = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { commentId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const updated = yield this._commentService.toggleLike(commentId, userId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, 'Like toggled', true, updated);
        });
        this.toggleDislike = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { commentId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const updated = yield this._commentService.toggleDislike(commentId, userId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, 'Dislike toggled', true, updated);
        });
    }
};
exports.EmployeeCommentController = EmployeeCommentController;
exports.EmployeeCommentController = EmployeeCommentController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.EmployeeCommentService)),
    __metadata("design:paramtypes", [Object])
], EmployeeCommentController);
