import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherReview extends Document {
  teacherId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const TeacherReviewSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ITeacherReview>(
  'TeacherReview',
  TeacherReviewSchema
);
