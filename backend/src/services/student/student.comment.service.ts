import { injectable, inject } from "inversify";
import { IComment } from "../../models/Comment";
import { TYPES } from "../../core/di/types";
import { ICommentRepository } from "../../core/interfaces/repositories/ICommentRepository";
import { IStudentCommentService } from "../../core/interfaces/services/student/IStudentCommentService";

@injectable()
export class StudentCommentService implements IStudentCommentService {
  constructor(@inject(TYPES.CommentRepository) private _commentRepo: ICommentRepository) {}

  async addComment(data: IComment):Promise<IComment> {
    return this._commentRepo.addComment(data);
  }

  async getComments(courseId: string):Promise<IComment[]> {
    return this._commentRepo.getCommentsByCourse(courseId);
  }

  async deleteComment(commentId: string):Promise<IComment | null> {
    return this._commentRepo.deleteComment(commentId);
  }
}
