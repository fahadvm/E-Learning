"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LessonSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    videoFile: { type: String },
    thumbnail: { type: String },
    duration: { type: Number }, // store in minutes
}, { _id: true });
const ModuleSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    lessons: { type: [LessonSchema], default: [] },
}, { _id: true });
const CourseSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, required: true },
    category: { type: String, required: true },
    language: { type: String, required: true },
    coverImage: { type: String },
    price: { type: Number, required: true, default: 0 },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isTechnicalCourse: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    status: { type: String, default: 'published' },
    rejectionReason: { type: String },
    teacherName: { type: String },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    totalDuration: { type: Number, default: 0 }, // (in minutes)
    reviews: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Review',
            required: false,
        },
    ],
    requirements: [{ type: String }],
    learningOutcomes: [{ type: String }],
    totalStudents: { type: Number, default: 0 },
    modules: { type: [ModuleSchema], default: [] },
}, {
    timestamps: true,
});
exports.Course = mongoose_1.default.model('Course', CourseSchema);
