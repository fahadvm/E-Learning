import { IComment } from '../../../../models/Comment';

export interface IStudentCommentService {
  addComment(comment: IComment): Promise<IComment>;
  getComments(courseId: string): Promise<IComment[]>;
  getReplies(parentId: string): Promise<IComment[]>;
  deleteComment(commentId: string, userId: string): Promise<IComment | null>;
  toggleLike(commentId: string, userId: string): Promise<IComment | null>;
  toggleDislike(commentId: string, userId: string): Promise<IComment | null>;
}
