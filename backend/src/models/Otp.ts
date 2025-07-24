import mongoose, { Schema, Document } from "mongoose";

interface TempUserData {
  name: string;
  password: string;
}

export interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  purpose?: "signup" | "forgot-password";
  tempUserData?: TempUserData;
}

const OtpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  purpose: { type: String, enum: ["signup", "forgot-password"] },
  tempUserData: {
    name: String,
    password: String,
  },
});

export const Otp = mongoose.model<IOtp>("Otp", OtpSchema);
