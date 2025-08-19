import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from "mongodb";

export interface ILesson {
  title: string;
  content?: string;
  videoUrl?: string;
  duration?: number; // store in seconds
}

export interface IModule {
  title: string;
  description?: string;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  description: string;
  level: string;
  category: string;
  language: string;
  price?: string;
  coverImage?: string;
  isBlocked: boolean;
  isVerified: boolean;
  isPublished: boolean;
  status: string;
  rejectionReason?: string;
  teacherId?: mongoose.Types.ObjectId;
  duration?: number; // total duration in seconds
  reviews?: mongoose.Types.ObjectId[];
  requirements?: string[];
  objectives?: string[];
  totalStudents?: number;
  modules: IModule[];
  createdAt?: Date;
  updatedAt?: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    content: { type: String },
    videoUrl: { type: String },
    duration: { type: Number }, // store in seconds
  },
  { _id: false }
);

const ModuleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true },
    description: { type: String },
    lessons: { type: [LessonSchema], default: [] },
  },
  { _id: false }
);

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, required: true },
    category: { type: String, required: true },
    language: { type: String, required: true },
    coverImage: { type: String },
    price: { type: String },
    
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    status: { type: String, default: 'pending' },
    rejectionReason: { type: String },

    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: false,
    },

    duration: { type: Number, default: 0 },// (in seconds)

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        required: false,
      },
    ],

    requirements: [{ type: String }],
    objectives: [{ type: String }],
    totalStudents: { type: Number, default: 0 },

    modules: { type: [ModuleSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
