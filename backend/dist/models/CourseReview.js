"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseReview = void 0;
const mongoose_1 = require("mongoose");
const CourseReviewSchema = new mongoose_1.Schema({
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Student", required: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
}, { timestamps: true });
exports.CourseReview = (0, mongoose_1.model)("CourseReview", CourseReviewSchema);
