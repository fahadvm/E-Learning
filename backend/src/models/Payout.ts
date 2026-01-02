import mongoose, { Schema, Document, Types } from 'mongoose';

export enum PayoutStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum PayoutMethod {
    BANK_TRANSFER = 'BANK_TRANSFER',
    UPI = 'UPI',
    PAYPAL = 'PAYPAL',
}

export interface IPayout extends Document {
    _id: Types.ObjectId;
    teacherId: Types.ObjectId;
    amount: number;
    status: PayoutStatus;
    method: PayoutMethod;
    details: Record<string, string>; // Flexible for bank details or UPI ID
    adminNote?: string;
    transactionId?: Types.ObjectId; // Link to the debit transaction
    createdAt?: Date;
    processedAt?: Date;
}

const PayoutSchema = new Schema<IPayout>(
    {
        teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
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
        details: { type: Schema.Types.Mixed, required: true },
        adminNote: { type: String },
        transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
        processedAt: { type: Date },
    },
    { timestamps: true }
);

export const Payout = mongoose.model<IPayout>('Payout', PayoutSchema);
