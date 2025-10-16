import { Schema, model, Types } from "mongoose";

export interface IComment {
  _id?: string;
  courseId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  createdAt?: Date;
}

const CommentSchema = new Schema<IComment>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export const Comment = model<IComment>("Comment", CommentSchema);
