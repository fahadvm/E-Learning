// src/models/subscriptionPlan.ts
import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from "mongodb";

export interface ISubscriptionPlan extends Document {
  _id: ObjectId;
  name: string
  price: number | 'Free' | 'Custom'
  planFor: 'company' | 'student'
  description: string
  features: string[]
  popular?: boolean
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  name: { type: String, required: true },
  price: { type: Schema.Types.Mixed, required: true },
  description: { type: String, required: true },
  features: [{ type: String, required: true }],
  planFor: { type: String, required: true },
  popular: { type: Boolean, default: false }
});

export const SubscriptionPlan = mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);

