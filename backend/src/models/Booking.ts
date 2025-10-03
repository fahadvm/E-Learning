import { Schema, model, Document, Types } from "mongoose";

export interface ITimeSlot {
  start: string;
  end: string;
}

export interface IBooking extends Document {
  studentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  courseId: Types.ObjectId;
  date: string;
  day: string;
  slot: ITimeSlot;
  note?: string;
  status: "pending" | "approved" | "paid" | "cancelled";
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
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    date: { type: String, required: true },
    day: { type: String, required: true },
    slot: { type: timeSlotSchema, required: true },
    note: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Booking = model<IBooking>("Booking", bookingSchema);
