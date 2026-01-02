import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWithdrawal {
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  requestedAt: Date;
  processedAt?: Date;
  transactionId?: Types.ObjectId; 
}

export interface ITeacherWallet extends Document {
  _id: Types.ObjectId;

  teacherId: Types.ObjectId;

  balance: number;          // current live balance
  totalEarned: number;      // lifetime earnings
  totalWithdrawn: number;   // lifetime withdrawals

  withdrawals: IWithdrawal[];

  createdAt?: Date;
  updatedAt?: Date;
}

const WithdrawalSchema = new Schema<IWithdrawal>(
  {
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    adminNote: { type: String },
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
  },
  { _id: false }
);

const TeacherWalletSchema = new Schema<ITeacherWallet>(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', unique: true, required: true },

    balance: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },

    withdrawals: { type: [WithdrawalSchema], default: [] },
  },
  { timestamps: true }
);

export const TeacherWallet = mongoose.model<ITeacherWallet>(
  'TeacherWallet',
  TeacherWalletSchema
);
