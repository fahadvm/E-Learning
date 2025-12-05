import mongoose, { Schema, Document } from "mongoose";
import { ICourse } from "./Course";

export interface ICompanyOrder extends Document {
  companyId: mongoose.Types.ObjectId;
  purchasedCourses: {
    courseId: mongoose.Types.ObjectId | ICourse;
    accessType: "seats" | "unlimited";
    seats: number;
    price: number;
  }[];
  stripeSessionId: string;
  paymentMethod: "razorpay" | "wallet" | "card";
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  platformFee: number;
  teacherShare: number;
  commissionRate: number;
}

const CompanyOrderSchema = new Schema<ICompanyOrder>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },

    purchasedCourses: [{
      courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
      accessType: { type: String, enum: ["seats", "unlimited"], required: true },
      seats: { type: Number, default: 0 },
      price: { type: Number, required: true }
    }],

    stripeSessionId: { type: String, required: true },
    paymentMethod: { type: String, enum: ["razorpay", "wallet", "card"], default: "razorpay" },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    platformFee: { type: Number, default: 0 },
    teacherShare: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0.2 }
  },
  { timestamps: true }
);

export const CompanyOrderModel = mongoose.model<ICompanyOrder>("CompanyOrder", CompanyOrderSchema);
 