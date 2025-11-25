import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICourseProgress {
  courseId:  Types.ObjectId;
  completedLessons: string[];
  completedModules: string[];
  percentage: number;
  lastVisitedLesson?: string;
  notes: string;
}






export interface IStudent extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  isVerified: boolean;
  about?: string;
  isBlocked: boolean;
  isPremium: boolean;
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
  coursesProgress: ICourseProgress[];


}

const CourseProgressSchema: Schema = new Schema<ICourseProgress>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  completedModules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
  percentage: { type: Number, default: 0 },
  lastVisitedLesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
  notes:{type:String ,default:''}
});

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
  isPremium: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  googleUser: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  social_links: {
    linkedin: { type: String },
    twitter: { type: String },
    instagram: { type: String }
  },
  coursesProgress: [CourseProgressSchema]

}, { timestamps: true, });


export const Student = mongoose.model<IStudent>('Student', StudentSchema);
