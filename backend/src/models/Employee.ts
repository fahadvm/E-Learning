import mongoose, { Schema, Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';


export interface ICourseProgress {
  courseId: Types.ObjectId;
  completedLessons: string[];
  completedModules: string[];
  percentage: number;
  lastVisitedLesson?: string;
  lastVisitedTime?: Date;
  notes: string;
}

export interface IEmployee extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  companyId?: mongoose.Types.ObjectId | null ;
  requestedCompanyId?: mongoose.Types.ObjectId| null;
  password?: string;
  profilePicture?: string;
  coursesAssigned: mongoose.Types.ObjectId[];
  position?: string;
  isBlocked: boolean;
  employeeID?: boolean;
  location: string;
  department: string;
  status: string;
  role: string;
  isVerified: boolean;
  subscription: boolean;
  googleId?: string;
  about?: string;
  phone?: string;
  social_links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  coursesProgress: ICourseProgress[];
  streakCount: number
  lastLoginDate: Date
  longestStreak: number

  // Rejection tracking
  rejectionReason?: string;
  rejectedAt?: Date;

  // Invitation tracking
  invitedBy?: mongoose.Types.ObjectId | null;
  invitedAt?: Date| null;

}

const CourseProgressSchema: Schema = new Schema<ICourseProgress>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  completedModules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
  percentage: { type: Number, default: 0 },
  lastVisitedLesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
  lastVisitedTime: { type: Date, default: Date.now },
  notes: { type: String, default: '' }
});

const EmployeeSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  requestedCompanyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  coursesAssigned: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  role: { type: String, default: 'employee' },
  position: { type: String },
  employeeID: { type: String },
  department: { type: String },
  googleId: { type: String },
  location: { type: String },
  about: { type: String },
  phone: { type: String },
  status: { type: String, default: 'notRequsted' },
  profilePicture: { type: String },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  subscription: { type: Boolean, default: false },
  social_links: {
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String }
  },
  coursesProgress: [CourseProgressSchema],
  streakCount: { type: Number, default: 0 },
  lastLoginDate: { type: Date },
  longestStreak: { type: Number, default: 0 },

  // Rejection tracking
  rejectionReason: { type: String },
  rejectedAt: { type: Date },

  // Invitation tracking
  invitedBy: { type: Schema.Types.ObjectId, ref: 'Company' },
  invitedAt: { type: Date },

}, { timestamps: true, });

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);