import { Schema, model, Types } from "mongoose";

export interface IComment {
  _id?: string;
  courseId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  content: string;
  createdAt?: Date;
}

const CommentSchema = new Schema<IComment>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "student", required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export const Comment = model<IComment>("Comment", CommentSchema);
