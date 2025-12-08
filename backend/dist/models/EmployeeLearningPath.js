"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeLearningPath = void 0;
// src/models/EmployeeLearningPath.ts
const mongoose_1 = require("mongoose");
const CourseInPathSchema = new mongoose_1.Schema({
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    icon: { type: String },
    locked: { type: Boolean, default: false },
    order: { type: Number, required: true },
});
const EmployeeLearningPathSchema = new mongoose_1.Schema({
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    icon: { type: String },
    courses: { type: [CourseInPathSchema], default: [] },
}, { timestamps: true });
exports.EmployeeLearningPath = (0, mongoose_1.model)('EmployeeLearningPath', EmployeeLearningPathSchema);
