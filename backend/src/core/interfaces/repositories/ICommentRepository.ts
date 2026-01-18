
import { IComment } from '../../../models/Comment';

export interface ICommentRepository {
   addComment(comment: IComment): Promise<IComment>
   getCommentsByCourse(courseId: string): Promise<IComment[]>
   getReplies(parentId: string): Promise<IComment[]>
   deleteComment(commentId: string): Promise<IComment | null>
   toggleLike(commentId: string, userId: string): Promise<IComment | null>
   toggleDislike(commentId: string, userId: string): Promise<IComment | null>
   findById(commentId: string): Promise<IComment | null>
}
