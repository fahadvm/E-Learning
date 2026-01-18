"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, refPath: 'userModel' },
    userModel: {
        type: String,
        required: true,
        enum: ['Student', 'Teacher', 'Employee', 'Company'],
        default: 'Student'
    },
    content: { type: String, required: true },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment', default: null },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId }],
    dislikes: [{ type: mongoose_1.Schema.Types.ObjectId }],
}, { timestamps: true });
exports.Comment = (0, mongoose_1.model)('Comment', CommentSchema);
