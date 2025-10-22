"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseResource = void 0;
// src/models/CourseResource.ts
const mongoose_1 = require("mongoose");
const CourseResourceSchema = new mongoose_1.Schema({
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
}, { timestamps: true });
exports.CourseResource = (0, mongoose_1.model)('CourseResource', CourseResourceSchema);
