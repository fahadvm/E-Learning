import mongoose, { Schema, Document } from 'mongoose';
import { ICourse } from './Course';

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  courses: (mongoose.Types.ObjectId | ICourse)[];
  razorpayOrderId: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed';
  platformFee: number;
  teacherShare: number;
  commissionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },

    courses: [{ type: Schema.Types.ObjectId, ref: 'Course', required: true }],

    razorpayOrderId: { type: String, required: true },

    paymentMethod: { type: String, enum: ['razorpay', 'wallet', 'card'], default: 'razorpay' },

    amount: { type: Number, required: true },

    currency: { type: String, required: true },

    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },

    platformFee: {
      type: Number,
      default: 0,
    },

    teacherShare: {
      type: Number,
      default: 0,
    },

    commissionRate: {
      type: Number,
      default: 0.2, // 20% platform fee
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);
