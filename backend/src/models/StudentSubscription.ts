import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentSubscription extends Document {
  studentId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  orderId: string;
  paymentId?: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled' | 'free';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSubscriptionSchema = new Schema<IStudentSubscription>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String },
    status: {
      type: String,
      enum: ['pending', 'active', 'expired', 'cancelled', 'free'],
      default: 'pending'
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }
  },
  { timestamps: true }
);

// Auto-calculate endDate based on plan duration when status becomes "active"
StudentSubscriptionSchema.pre('save', async function (next) {
  if (this.isModified('status') && this.status === 'active') {
    const plan = await mongoose.model('Plan').findById(this.planId);
    if (plan) {
      this.startDate = new Date();
      this.endDate = new Date(
        this.startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000
      );
    }
  }
  next();
});


export const StudentSubscription = mongoose.model<IStudentSubscription>('StudentSubscription', StudentSubscriptionSchema);

