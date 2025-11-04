// src/models/EmployeeLearningPath.ts
import { Schema, model, Document, Types } from 'mongoose';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ICourseInPath {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  duration?: string;
  difficulty: Difficulty;
  icon?: string;
  locked?: boolean;   
  order: number;      
}

export interface IEmployeeLearningPath extends Document {
  companyId: Types.ObjectId;
  title: string;
  description?: string;
  category: string;
  difficulty: Difficulty;
  icon?: string;
  courses: ICourseInPath[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseInPathSchema = new Schema<ICourseInPath>({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: String },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  icon: { type: String },
  locked: { type: Boolean, default: false },
  order: { type: Number, required: true },
});

const EmployeeLearningPathSchema = new Schema<IEmployeeLearningPath>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    icon: { type: String },
    courses: { type: [CourseInPathSchema], default: [] },
  },
  { timestamps: true }
);

export const EmployeeLearningPath = model<IEmployeeLearningPath>('EmployeeLearningPath', EmployeeLearningPathSchema);
