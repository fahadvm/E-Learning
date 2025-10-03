import mongoose, { Schema, Document } from "mongoose";
import { ICourse } from "./Course";

export interface ICompanyOrder extends Document {
  companyId: mongoose.Types.ObjectId ;
  courses:  (mongoose.Types.ObjectId | ICourse)[]; 
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
}

const CompanyOrderSchema = new Schema<ICompanyOrder>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course", required: true }],
    stripeSessionId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
  },
  { timestamps: true }
);

export const CompanyOrderModel = mongoose.model<ICompanyOrder>("CompanyOrder", CompanyOrderSchema);
