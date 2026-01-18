import { injectable, inject } from 'inversify';
import { IComment } from '../../models/Comment';
import { TYPES } from '../../core/di/types';
import { ICommentRepository } from '../../core/interfaces/repositories/ICommentRepository';
import { IEmployeeCommentService } from '../../core/interfaces/services/employee/IEmployeeCommentService';

import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

@injectable()
export class EmployeeCommentService implements IEmployeeCommentService {
  constructor(@inject(TYPES.CommentRepository) private _commentRepo: ICommentRepository) { }

  async addComment(data: IComment): Promise<IComment> {
    return this._commentRepo.addComment(data);
  }

  async getComments(courseId: string): Promise<IComment[]> {
    return this._commentRepo.getCommentsByCourse(courseId);
  }

  async getReplies(parentId: string): Promise<IComment[]> {
    return this._commentRepo.getReplies(parentId);
  }

  async deleteComment(commentId: string, userId: string): Promise<IComment | null> {
    const comment = await this._commentRepo.findById(commentId);
    if (!comment) throwError('Comment not found', STATUS_CODES.NOT_FOUND);

    if (comment.userId.toString() !== userId) {
      throwError('Unauthorized to delete this comment', STATUS_CODES.UNAUTHORIZED);
    }

    return this._commentRepo.deleteComment(commentId);
  }

  async toggleLike(commentId: string, userId: string): Promise<IComment | null> {
    return this._commentRepo.toggleLike(commentId, userId);
  }

  async toggleDislike(commentId: string, userId: string): Promise<IComment | null> {
    return this._commentRepo.toggleDislike(commentId, userId);
  }
}
