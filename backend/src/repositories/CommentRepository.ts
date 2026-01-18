import { injectable } from 'inversify';
import { Comment, IComment } from '../models/Comment';
import { Types } from 'mongoose';
import { ICommentRepository } from '../core/interfaces/repositories/ICommentRepository';

@injectable()
export class CommentRepository implements ICommentRepository {
    async addComment(comment: IComment): Promise<IComment> {
        const newComment = new Comment(comment);
        const saved = await newComment.save();

        return await saved.populate('userId', '_id name profilePicture');
    }

    async getCommentsByCourse(courseId: string): Promise<IComment[]> {
        const topLevelComments = await Comment.find({
            courseId: new Types.ObjectId(courseId),
            parentId: null
        })
            .populate('userId', '_id name profilePicture')
            .sort({ createdAt: -1 });

        const commentsWithCounts = await Promise.all(topLevelComments.map(async (comment) => {
            const count = await Comment.countDocuments({ parentId: comment._id });
            return {
                ...comment.toObject(),
                replyCount: count
            } as IComment;
        }));

        return commentsWithCounts;
    }

    async getReplies(parentId: string): Promise<IComment[]> {
        return await Comment.find({ parentId: new Types.ObjectId(parentId) })
            .populate('userId', '_id name profilePicture')
            .sort({ createdAt: 1 });
    }

    async deleteComment(commentId: string): Promise<IComment | null> {
        // Delete all replies first
        await Comment.deleteMany({ parentId: new Types.ObjectId(commentId) });
        const deleted = await Comment.findByIdAndDelete(commentId);
        return deleted;
    }

    async toggleLike(commentId: string, userId: string): Promise<IComment | null> {
        const comment = await Comment.findById(commentId);
        if (!comment) return null;

        const uId = new Types.ObjectId(userId);
        const likedIndex = comment.likes.findIndex(id => id.toString() === userId);

        if (likedIndex > -1) {
            comment.likes.splice(likedIndex, 1);
        } else {
            comment.likes.push(uId);
            // Remove from dislikes
            const dislikedIndex = comment.dislikes.findIndex(id => id.toString() === userId);
            if (dislikedIndex > -1) comment.dislikes.splice(dislikedIndex, 1);
        }
        const saved = await comment.save();
        return await saved.populate('userId', '_id name profilePicture');
    }

    async toggleDislike(commentId: string, userId: string): Promise<IComment | null> {
        const comment = await Comment.findById(commentId);
        if (!comment) return null;

        const uId = new Types.ObjectId(userId);
        const dislikedIndex = comment.dislikes.findIndex(id => id.toString() === userId);

        if (dislikedIndex > -1) {
            comment.dislikes.splice(dislikedIndex, 1);
        } else {
            comment.dislikes.push(uId);
            // Remove from likes
            const likedIndex = comment.likes.findIndex(id => id.toString() === userId);
            if (likedIndex > -1) comment.likes.splice(likedIndex, 1);
        }
        const saved = await comment.save();
        return await saved.populate('userId', '_id name profilePicture');
    }

    async findById(commentId: string): Promise<IComment | null> {
        return await Comment.findById(commentId);
    }
}
