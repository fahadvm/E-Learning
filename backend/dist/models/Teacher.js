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
exports.Teacher = exports.VerificationStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["UNVERIFIED"] = "unverified";
    VerificationStatus["PENDING"] = "pending";
    VerificationStatus["VERIFIED"] = "verified";
    VerificationStatus["REJECTED"] = "rejected";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
const EducationSchema = new mongoose_1.Schema({
    degree: { type: String, required: true },
    description: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    institution: { type: String, required: true },
}, { _id: false });
const ExperienceSchema = new mongoose_1.Schema({
    company: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
}, { _id: false });
const SocialLinksSchema = new mongoose_1.Schema({
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
}, { _id: false });
const TeacherSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
    },
    googleId: { type: String },
    role: { type: String, default: 'Teacher' },
    verificationStatus: { type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.UNVERIFIED },
    verificationReason: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    googleUser: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    about: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    location: { type: String, default: '' },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    social_links: { type: SocialLinksSchema, default: {} },
    education: { type: [EducationSchema], default: [] },
    experiences: { type: [ExperienceSchema], default: [] },
    skills: { type: [String], default: [] },
    review: { type: String },
    comment: { type: String },
    rating: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Teacher = mongoose_1.default.model('Teacher', TeacherSchema);
