// src/models/CourseResource.ts
import mongoose, { Schema, model, Document } from 'mongoose';


export interface ICourseResource extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  fileUrl: string;
  fileType: string;
}

const CourseResourceSchema = new Schema<ICourseResource>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
  },
  { timestamps: true }
);

export const CourseResource = model<ICourseResource>(
  'CourseResource',
  CourseResourceSchema
);
