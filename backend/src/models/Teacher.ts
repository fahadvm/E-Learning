import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  name: string;
  email: string;
  password: string;
  courses?: mongoose.Types.ObjectId[];
  isVerified?: boolean;
}

const TeacherSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
});

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);
