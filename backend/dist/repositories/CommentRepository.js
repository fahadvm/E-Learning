"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.CommentRepository = void 0;
const inversify_1 = require("inversify");
const Comment_1 = require("../models/Comment");
const mongoose_1 = require("mongoose");
let CommentRepository = class CommentRepository {
    addComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = new Comment_1.Comment(comment);
            const saved = yield newComment.save();
            return yield saved.populate('userId', '_id name profilePicture');
        });
    }
    getCommentsByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const topLevelComments = yield Comment_1.Comment.find({
                courseId: new mongoose_1.Types.ObjectId(courseId),
                parentId: null
            })
                .populate('userId', '_id name profilePicture')
                .sort({ createdAt: -1 });
            const commentsWithCounts = yield Promise.all(topLevelComments.map((comment) => __awaiter(this, void 0, void 0, function* () {
                const count = yield Comment_1.Comment.countDocuments({ parentId: comment._id });
                return Object.assign(Object.assign({}, comment.toObject()), { replyCount: count });
            })));
            return commentsWithCounts;
        });
    }
    getReplies(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Comment_1.Comment.find({ parentId: new mongoose_1.Types.ObjectId(parentId) })
                .populate('userId', '_id name profilePicture')
                .sort({ createdAt: 1 });
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Delete all replies first
            yield Comment_1.Comment.deleteMany({ parentId: new mongoose_1.Types.ObjectId(commentId) });
            const deleted = yield Comment_1.Comment.findByIdAndDelete(commentId);
            return deleted;
        });
    }
    toggleLike(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield Comment_1.Comment.findById(commentId);
            if (!comment)
                return null;
            const uId = new mongoose_1.Types.ObjectId(userId);
            const likedIndex = comment.likes.findIndex(id => id.toString() === userId);
            if (likedIndex > -1) {
                comment.likes.splice(likedIndex, 1);
            }
            else {
                comment.likes.push(uId);
                // Remove from dislikes
                const dislikedIndex = comment.dislikes.findIndex(id => id.toString() === userId);
                if (dislikedIndex > -1)
                    comment.dislikes.splice(dislikedIndex, 1);
            }
            const saved = yield comment.save();
            return yield saved.populate('userId', '_id name profilePicture');
        });
    }
    toggleDislike(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield Comment_1.Comment.findById(commentId);
            if (!comment)
                return null;
            const uId = new mongoose_1.Types.ObjectId(userId);
            const dislikedIndex = comment.dislikes.findIndex(id => id.toString() === userId);
            if (dislikedIndex > -1) {
                comment.dislikes.splice(dislikedIndex, 1);
            }
            else {
                comment.dislikes.push(uId);
                // Remove from likes
                const likedIndex = comment.likes.findIndex(id => id.toString() === userId);
                if (likedIndex > -1)
                    comment.likes.splice(likedIndex, 1);
            }
            const saved = yield comment.save();
            return yield saved.populate('userId', '_id name profilePicture');
        });
    }
    findById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Comment_1.Comment.findById(commentId);
        });
    }
};
exports.CommentRepository = CommentRepository;
exports.CommentRepository = CommentRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentRepository);
