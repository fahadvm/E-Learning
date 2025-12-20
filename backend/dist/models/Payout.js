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
exports.Payout = exports.PayoutMethod = exports.PayoutStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var PayoutStatus;
(function (PayoutStatus) {
    PayoutStatus["PENDING"] = "PENDING";
    PayoutStatus["APPROVED"] = "APPROVED";
    PayoutStatus["REJECTED"] = "REJECTED";
})(PayoutStatus || (exports.PayoutStatus = PayoutStatus = {}));
var PayoutMethod;
(function (PayoutMethod) {
    PayoutMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PayoutMethod["UPI"] = "UPI";
    PayoutMethod["PAYPAL"] = "PAYPAL";
})(PayoutMethod || (exports.PayoutMethod = PayoutMethod = {}));
const PayoutSchema = new mongoose_1.Schema({
    teacherId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(PayoutStatus),
        default: PayoutStatus.PENDING,
    },
    method: {
        type: String,
        enum: Object.values(PayoutMethod),
        required: true,
    },
    details: { type: mongoose_1.Schema.Types.Mixed, required: true },
    adminNote: { type: String },
    transactionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Transaction' },
    processedAt: { type: Date },
}, { timestamps: true });
exports.Payout = mongoose_1.default.model('Payout', PayoutSchema);
