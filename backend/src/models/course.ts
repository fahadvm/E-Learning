import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from "mongodb";

interface ILesson {
  title: string;
  content?: string;
  videoUrl?: string;
}

interface IModule {
  title: string;
  description?: string;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  level: string;
  category: string;
  price?: string;
  coverImage?: string;
  isBlocked: boolean;
  isVerified: boolean;
  status: string;
  rejectReason?: string;
  teacherId?: mongoose.Types.ObjectId;
  modules: IModule[];
  createdAt?: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    content: { type: String },
    videoUrl: { type: String },
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
    description: { type: String, required: true },
    level: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: { type: String },
    price: { type: String },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    status: { type: String, default: 'pending' },
    rejectReason: { type: String },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: false,
    },
    modules: { type: [ModuleSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
