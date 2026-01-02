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
exports.CompanyOrderModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CompanyOrderSchema = new mongoose_1.Schema({
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true },
    purchasedCourses: [{
            courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
            accessType: { type: String, enum: ['seats', 'unlimited'], required: true },
            seats: { type: Number, default: 0 },
            price: { type: Number, required: true }
        }],
    stripeSessionId: { type: String, required: true },
    paymentMethod: { type: String, enum: ['razorpay', 'wallet', 'card'], default: 'razorpay' },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    platformFee: { type: Number, default: 0 },
    teacherShare: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0.2 }
}, { timestamps: true });
exports.CompanyOrderModel = mongoose_1.default.model('CompanyOrder', CompanyOrderSchema);
