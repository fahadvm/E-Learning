import mongoose, { Schema, Document, Types } from 'mongoose';

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export interface Education {
  degree: string;
  description: string;
  from: string;
  to: string;
  institution: string;
}

export interface Experience {
  company: string;
  title: string;
  type: string;
  location: string;
  from: string;
  to: string;
  duration: string;
  description: string;
}

export interface SocialLinks {
  linkedin: string;
  twitter: string;
  instagram: string;
}

export interface ITeacher extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  verificationStatus: VerificationStatus;
  verificationReason?: string;
  isVerified: boolean;
  isRejected: boolean;
  isBlocked: boolean;
  otp?: string;
  role: string;
  otpExpiry?: Date;
  googleId?: string;
  googleUser: boolean;
  about: string;
  profilePicture: string;
  location: string;
  phone: string;
  website: string;
  resumeUrl: string;
  social_links: SocialLinks;
  education: Education[];
  experiences: Experience[];
  skills: string[];
  review?: string;
  comment?: string;
  rating?: number;
  userId: string;
  createdAt: Date,
  updatedAt: Date
}

const EducationSchema = new Schema<Education>(
  {
    degree: { type: String, required: true },
    description: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    institution: { type: String, required: true },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<Experience>(
  {
    company: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const SocialLinksSchema = new Schema<SocialLinks>(
  {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
  { _id: false }
);

const TeacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: { type: String },
    role: { type: String, default: 'Teacher' },
    verificationStatus: { type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.UNVERIFIED },
    verificationReason: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    googleUser: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    about: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    location: { type: String, default: '' },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    social_links: { type: SocialLinksSchema, default: {} },
    education: { type: [EducationSchema], default: [] },
    experiences: { type: [ExperienceSchema], default: [] },
    skills: { type: [String], default: [] },
    review: { type: String },
    comment: { type: String },
    rating: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

  },
  {
    timestamps: true,
  }
);

export const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);
