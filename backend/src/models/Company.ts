    import mongoose, { Schema, Document } from 'mongoose';
    import { ObjectId } from "mongodb";

    export interface ICompany extends Document {
      _id: ObjectId;
      name: string;
      email: string;
      password: string;
      status: string;
      rejectReason: string;
      employees: mongoose.Types.ObjectId[];
      isPremium: boolean; 
      isVerified: boolean; 
      createdAt: Date;
      updatedAt: Date;
    }

    const CompanySchema: Schema = new Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      rejectReason: { type: String, required: false },
      status: { type: String, required: false },
      isPremium: { type: Boolean, default: false },
      isVerified: { type: Boolean, default: false },
      employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],

    }, { timestamps: true, });

    export const Company = mongoose.model<ICompany>('Company', CompanySchema);
