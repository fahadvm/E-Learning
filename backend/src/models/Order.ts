import mongoose, { Schema, Document } from "mongoose";
import { ICourse } from "./Course";

export interface IOrder extends Document {
  studentId: mongoose.Types.ObjectId ;
  courses:  (mongoose.Types.ObjectId | ICourse)[]; 
  razorpayOrderId: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
}

const OrderSchema = new Schema<IOrder>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course", required: true }],
    razorpayOrderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
