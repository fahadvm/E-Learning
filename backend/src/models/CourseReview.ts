import { Schema, model, Document, Types } from 'mongoose';

export interface ICourseReview extends Document {
  studentId?: Types.ObjectId;
  employeeId?: Types.ObjectId;
  courseId: Types.ObjectId;
  rating: number;
  comment: string;
}

const CourseReviewSchema = new Schema<ICourseReview>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

export const CourseReview = model<ICourseReview>('CourseReview', CourseReviewSchema);
