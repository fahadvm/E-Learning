import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  userRole: 'student' | 'teacher' | 'company' | 'admin' | 'employee';
  title: string;
  message: string;
  link?: string;
  type: string; // "booking", "payment", "system", etc.
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, refPath: 'userRole', required: true },
    userRole: { type: String, enum: ['student', 'teacher', 'company', 'admin', 'employee'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    type: { type: String, default: 'general' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = model<INotification>('Notification', notificationSchema);
