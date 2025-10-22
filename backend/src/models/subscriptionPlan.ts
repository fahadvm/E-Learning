// src/models/subscriptionPlan.ts
import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IFeature {
  name: string;
  description: string;
}

export interface ISubscriptionPlan extends Document {
  _id: ObjectId;
  name: string;
  price: number;
  planFor: 'company' | 'student';
  description: string;
  features: IFeature[];
  popular?: boolean;
}

const FeatureSchema = new Schema<IFeature>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  name: { type: String, required: true },
  price: { type: Schema.Types.Mixed, required: true },
  description: { type: String, required: true },
  features: { type: [FeatureSchema], required: true },
  planFor: { type: String, required: true },
  popular: { type: Boolean, default: false },
}, { timestamps: true });

export const SubscriptionPlan = mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);
