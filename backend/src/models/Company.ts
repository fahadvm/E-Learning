import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface RegistrationDocs {
  certificate?: string;
  taxId?: string;
};

export interface ICompany extends Document {
  _id: ObjectId;
  name: string;
  about?: string;
  phone?: string;
  website?: string;
  profilePicture?: string;
  address?: string;
  companyCode: string;
  email: string;
  password: string;
  status: string;
  rejectReason?: string;
  employees: mongoose.Types.ObjectId[];
  isPremium: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  social_links?: SocialLinks;
  registrationDocs?:RegistrationDocs;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    about: { type: String },
    phone: { type: String },
    website: { type: String },
    profilePicture: { type: String },
    address:  { type: String },
    companyCode: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rejectReason: { type: String },
    status: { type: String },
    isPremium: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
    social_links: {
      linkedin: { type: String },
      twitter: { type: String },
      instagram: { type: String },
    },
    registrationDocs: {
      certificate: { type: String },
      taxId: { type: String },
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
