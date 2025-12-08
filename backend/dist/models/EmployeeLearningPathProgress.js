"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeLearningPathProgress = void 0;
const mongoose_1 = require("mongoose");
const EmployeeLearningPathProgressSchema = new mongoose_1.Schema({
    employeeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Employee", required: true },
    learningPathId: { type: mongoose_1.Schema.Types.ObjectId, ref: "EmployeeLearningPath", required: true },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Company", required: true },
    currentCourse: {
        index: { type: Number, default: 0 },
        courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course" },
        percentage: { type: Number, default: 0 }
    },
    completedCourses: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Course" }],
    percentage: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "paused", "completed"], default: "active" },
}, { timestamps: true });
exports.EmployeeLearningPathProgress = (0, mongoose_1.model)("EmployeeLearningPathProgress", EmployeeLearningPathProgressSchema);
