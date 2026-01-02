import mongoose, { Schema, Document, Types } from 'mongoose';

export type TransactionType =
  | 'COURSE_PURCHASE'
  | 'MEETING_BOOKING'
  | 'SUBSCRIPTION_PURCHASE'
  | 'TEACHER_EARNING'
  | 'TEACHER_WITHDRAWAL'
  | 'ADMIN_ADJUSTMENT';

export type TxnNature = 'CREDIT' | 'DEBIT';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type PaymentMethod = 'RAZORPAY' | 'STRIPE' | 'WALLET' | 'MANUAL';

export interface ITransaction extends Document {
  _id: Types.ObjectId;

  userId?: Types.ObjectId;
  teacherId?: Types.ObjectId;
  companyId?: Types.ObjectId;

  courseId?: Types.ObjectId;
  meetingId?: Types.ObjectId;

  type: TransactionType;
  txnNature: TxnNature;

  // amount applied to wallet (credits or debits)
  amount: number;

  // purchase details
  grossAmount: number;      // course price or meeting price
  teacherShare: number;     // teacher earning
  platformFee: number;      // admin/platform earning

  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Student' },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },

    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting' },

    type: {
      type: String,
      enum: [
        'COURSE_PURCHASE',
        'MEETING_BOOKING',
        'SUBSCRIPTION_PURCHASE',
        'TEACHER_EARNING',
        'TEACHER_WITHDRAWAL',
        'ADMIN_ADJUSTMENT',
      ],
      required: true,
    },

    txnNature: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      required: true,
    },

    amount: { type: Number, required: true },

    // NEW fields ↓↓↓
    grossAmount: { type: Number, required: true },
    teacherShare: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },

    paymentStatus: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'SUCCESS',
    },

    paymentMethod: {
      type: String,
      enum: ['RAZORPAY', 'STRIPE', 'WALLET', 'MANUAL'],
      required: true,
    },

    notes: { type: String },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
  'Transaction',
  TransactionSchema
);
