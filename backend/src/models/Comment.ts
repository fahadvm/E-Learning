import { Schema, model, Types } from 'mongoose';

export interface IComment {
  _id?: string;
  courseId: Types.ObjectId;
  userId: Types.ObjectId;
  userModel: 'Student' | 'Teacher' | 'Employee' | 'Company';
  content: string;
  parentId?: Types.ObjectId; // For nested replies
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  replies?: IComment[];   // Optional nested replies
  replyCount?: number;    // Optional count of replies
}

const CommentSchema = new Schema<IComment>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  userId: { type: Schema.Types.ObjectId, required: true, refPath: 'userModel' },
  userModel: {
    type: String,
    required: true,
    enum: ['Student', 'Teacher', 'Employee', 'Company'],
    default: 'Student'
  },
  content: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
  likes: [{ type: Schema.Types.ObjectId }],
  dislikes: [{ type: Schema.Types.ObjectId }],
}, { timestamps: true });

export const Comment = model<IComment>('Comment', CommentSchema);
