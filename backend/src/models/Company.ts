import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  email: string;
  password: string;
  employees: mongoose.Types.ObjectId[];
  isPremium: boolean; 
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],

}, { timestamps: true, });

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
