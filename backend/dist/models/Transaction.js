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
exports.Transaction = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TransactionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Student" },
    teacherId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Teacher" },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course" },
    meetingId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Meeting" },
    type: {
        type: String,
        enum: [
            "COURSE_PURCHASE",
            "MEETING_BOOKING",
            "SUBSCRIPTION_PURCHASE",
            "TEACHER_EARNING",
            "TEACHER_WITHDRAWAL",
            "ADMIN_ADJUSTMENT",
        ],
        required: true,
    },
    txnNature: {
        type: String,
        enum: ["CREDIT", "DEBIT"],
        required: true,
    },
    amount: { type: Number, required: true },
    // NEW fields ↓↓↓
    grossAmount: { type: Number, required: true },
    teacherShare: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "SUCCESS",
    },
    paymentMethod: {
        type: String,
        enum: ["RAZORPAY", "STRIPE", "WALLET", "MANUAL"],
        required: true,
    },
    notes: { type: String },
}, { timestamps: true });
exports.Transaction = mongoose_1.default.model("Transaction", TransactionSchema);
