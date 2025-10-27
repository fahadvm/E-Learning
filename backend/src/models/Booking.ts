import { Schema, model, Document, Types } from 'mongoose';

export interface ITimeSlot {
  start: string;
  end: string;
}

export interface IBooking extends Document {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  courseId: Types.ObjectId;
  date: string;
  day: string;
  slot: ITimeSlot;
  note?: string;
  paymentOrderId?: string;
  status: 'pending' | 'booked' | 'cancelled' | 'rescheduled' | 'failed';
  rejectionReason?: string;
  cancellationReason?: string;
  rescheduledFrom?: Types.ObjectId;
  rescheduledTo?: Types.ObjectId;
  rescheduledReason?: string;
  rescheduledAt?: Date;
  expireAt?: Date,
  createdAt: Date;
  updatedAt: Date;
}

const timeSlotSchema = new Schema<ITimeSlot>(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false }
);

const bookingSchema = new Schema<IBooking>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    paymentOrderId: { type: String },
    date: { type: String, required: true },
    day: { type: String, required: true },
    slot: { type: timeSlotSchema, required: true },
    note: { type: String, default: '' },
    rejectionReason: { type: String },
    cancellationReason: { type: String },
    rescheduledFrom: { type: Schema.Types.ObjectId, ref: 'Booking' },
    rescheduledTo: { type: Schema.Types.ObjectId, ref: 'Booking' },
    rescheduledReason: { type: String },
    rescheduledAt: { type: Date },
    expireAt: { type: Date, default: () => new Date(Date.now() + 10 * 60 * 1000) },
    status: {
      type: String,
      enum: ['pending', 'booked', 'cancelled', 'rescheduled', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { status: 'pending' } });
export const Booking = model<IBooking>('Booking', bookingSchema);
