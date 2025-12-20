import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IAdmin extends Document {
  _id: ObjectId;
  name?: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
  role: 'admin';
  isSuperAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    bio: { type: String },
    role: { type: String, enum: ['admin'], default: 'admin' },
    isSuperAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
