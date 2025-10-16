import { injectable } from "inversify";
import { Comment, IComment } from "../models/Comment";
import { Types } from "mongoose";
import { ICommentRepository } from "../core/interfaces/repositories/ICommentRepository";

@injectable()
export class CommentRepository implements ICommentRepository {
    async addComment(comment: IComment): Promise<IComment> {
        const newComment = new Comment(comment);
        return await newComment.save();
    }

    async getCommentsByCourse(courseId: string): Promise<IComment[]> {
        return await Comment.find({ courseId: new Types.ObjectId(courseId) })
            .populate("userId", "_id name profilePicture")
            .sort({ createdAt: -1 });
    }


    async deleteComment(commentId: string): Promise<IComment | null> {
        const deleted = await Comment.findByIdAndDelete(commentId);
        return deleted
    }
}
