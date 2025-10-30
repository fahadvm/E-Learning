
import { IComment } from '../../../../models/Comment';

export interface IEmployeeCommentService
 {
  addComment(comment: IComment): Promise<IComment>;
  getComments(courseId: string): Promise<IComment[]>;
  deleteComment(commentId: string): Promise<IComment | null>;
}
