  import mongoose, { Schema, Document ,Types  } from 'mongoose';


  export interface IStudent extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    isVerified: boolean;
    about?: string;
    isBlocked: boolean;
    phone?: string;
    otp?: string;
    role: string;
    otpExpiry?: Date;
    googleId?: string;
    profilePicture?: string;
    googleUser: boolean;
    social_links?: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
    };
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
    about: { type: String },
    phone: { type: String },
    profilePicture: { type: String },
    role: { type: String, default: 'student' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    googleUser: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    social_links: {
      linkedin: { type: String },
      twitter: { type: String },
      instagram: { type: String }
    }

  });

  export const Student = mongoose.model<IStudent>('Student', StudentSchema);
