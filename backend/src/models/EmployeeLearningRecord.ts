import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILearningCourse {
  courseId: Types.ObjectId;
  hours: number; // or minutes if you prefer
}

export interface IEmployeeLearningRecord extends Document {
  employeeId: Types.ObjectId;
  companyId?: Types.ObjectId;
  date: Date; 
  totalHours: number;
  courses: ILearningCourse[];
  createdAt?: Date;
  updatedAt?: Date;
}

const LearningCourseSchema = new Schema<ILearningCourse>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  hours: { type: Number, default: 0 },
}, { _id: false });

const EmployeeLearningRecordSchema = new Schema<IEmployeeLearningRecord>({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  date: { type: Date, required: true }, 
  totalHours: { type: Number, default: 0 },
  courses: [LearningCourseSchema],
}, { timestamps: true });

// Ensure an employee has only one record per day
EmployeeLearningRecordSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const EmployeeLearningRecord = mongoose.model<IEmployeeLearningRecord>(
  'EmployeeLearningRecord',
  EmployeeLearningRecordSchema
);
