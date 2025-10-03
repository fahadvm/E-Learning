
import mongoose, { Schema, Document } from 'mongoose';
import { ICourse } from './Course';

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  courses:(mongoose.Types.ObjectId | ICourse)[];
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course', required: true }],
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
