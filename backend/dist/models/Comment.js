"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Student', required: true },
    content: { type: String, required: true },
}, { timestamps: true });
exports.Comment = (0, mongoose_1.model)('Comment', CommentSchema);
