import { IComment } from "../../../../models/Comment";

export interface IStudentCommentService {
  addComment(comment: IComment): Promise<IComment>;
  getComments(courseId: string): Promise<IComment[]>;
  deleteComment(commentId: string): Promise<IComment | null>;
}
