import mongoose, { Schema, Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { ITeacher } from './Teacher';

export interface ILesson {
  _id?: ObjectId
  title: string;
  description?: string;
  videoFile?: string;
  thumbnail?: string;
  duration?: number; // store in minutes
}

export interface IModule {
  _id?: ObjectId
  title: string;
  description?: string;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  _id: Types.ObjectId;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  category: string;
  language: string;
  isTechnicalCourse: boolean;
  price?: number;
  coverImage?: string;
  isBlocked: boolean;
  blockReason?: string;
  isVerified: boolean;
  isPublished: boolean;
  status: string;
  rejectionReason?: string;
  teacherId?: mongoose.Types.ObjectId | ITeacher;
  teacherName?: string;
  totalDuration?: number; // total duration in minutes
  reviews?: mongoose.Types.ObjectId[];
  averageRating: number,
  reviewCount: number,
  requirements?: string[];
  learningOutcomes?: string[];
  totalStudents?: number;
  modules: IModule[];
  createdAt?: Date;
  updatedAt?: Date;
}

const LessonSchema = new Schema<ILesson>(
  {

    title: { type: String, required: true },
    description: { type: String },
    videoFile: { type: String },
    thumbnail: { type: String },
    duration: { type: Number }, // store in minutes
  },
  { _id: true }
);

const ModuleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true },
    description: { type: String },
    lessons: { type: [LessonSchema], default: [] },
  },
  { _id: true }
);

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, required: true },
    category: { type: String, required: true },
    language: { type: String, required: true },
    coverImage: { type: String },
    price: { type: Number, required: true, default: 0 },

    isBlocked: { type: Boolean, default: false },
    blockReason: { type: String },
    isVerified: { type: Boolean, default: false },
    isTechnicalCourse: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    status: { type: String, default: 'published' },
    rejectionReason: { type: String },
    teacherName: { type: String },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },

    totalDuration: { type: Number, default: 0 },// (in minutes)

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        required: false,
      },
    ],

    requirements: [{ type: String }],
    learningOutcomes: [{ type: String }],
    totalStudents: { type: Number, default: 0 },

    modules: { type: [ModuleSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
