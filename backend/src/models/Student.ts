import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  email: string;
  password?: string;
  isVerified: boolean;
  isBlocked: boolean;
  otp?: string;
  role: string;
  otpExpiry?: Date;
  googleId?: string;
  profilePicture?: string;
  googleUser: boolean;
}

const StudentSchema: Schema = new Schema<IStudent>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  googleId: { type: String },
  profilePicture: { type: String },
  role: { type: String, default: "student" },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  googleUser: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
});

export const Student = mongoose.model<IStudent>("Student", StudentSchema);
