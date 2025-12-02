import mongoose, { Schema, Document } from "mongoose";

export interface ICourseCertificate extends Document {
  studentId: string;
  courseId: string;
  certificateUrl: string;
  certificateNumber: string;
  issuedAt: Date;
}

const courseCertificateSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    certificateUrl: { type: String, required: true },
    certificateNumber: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ICourseCertificate>(
  "CourseCertificate",
  courseCertificateSchema
);
