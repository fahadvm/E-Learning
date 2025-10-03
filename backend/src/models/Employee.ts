import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IEmployee extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  companyId?: mongoose.Types.ObjectId;
  requestedCompanyId?: mongoose.Types.ObjectId;
  password?: string;
  profilePicture?: string;
  coursesAssigned: mongoose.Types.ObjectId[];
  position?: string;
  isBlocked: boolean;
  status: string;
  role: string;
  isVerified: boolean;
  subscription: boolean;
  googleId?: string;
  about?: string;
  phone?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };


}

const EmployeeSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  requestedCompanyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  coursesAssigned: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  role: { type: String, default: 'employee' },
  position: { type: String },
  googleId: { type: String },
  about: { type: String },
  phone: { type: String },
  status: { type: String , default: 'notRequsted' },
  profilePicture: { type: String },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  subscription: { type: Boolean, default: false },
  social_links: {
    linkedin: { type: String },
    twitter: { type: String },
    instagram: { type: String }
  }
}, { timestamps: true, });

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);

