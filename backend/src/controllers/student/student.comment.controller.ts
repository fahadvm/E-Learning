import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/di/types';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { StudentCommentService } from '../../services/student/student.comment.service';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { sendResponse } from '../../utils/ResANDError';
import { Types } from 'mongoose';

import { IStudentCommentService } from '../../core/interfaces/services/student/IStudentCommentService';

@injectable()
export class StudentCommentController {
  constructor(@inject(TYPES.StudentCommentService) private _commentService: IStudentCommentService) { }

  addComment = async (req: AuthRequest, res: Response) => {
    const { content, parentId } = req.body;
    const { courseId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    // Map role to valid model name for refPath
    let userModel: 'Student' | 'Teacher' | 'Employee' | 'Company' = 'Student';
    if (role === 'teacher') userModel = 'Teacher';
    else if (role === 'employee') userModel = 'Employee';
    else if (role === 'company') userModel = 'Company';

    const comment = await this._commentService.addComment({
      courseId: new Types.ObjectId(courseId),
      userId: new Types.ObjectId(userId),
      userModel,
      content,
      likes: [],
      dislikes: [],
      parentId: parentId ? new Types.ObjectId(parentId) : undefined
    });

    sendResponse(res, STATUS_CODES.OK, 'Comment added', true, comment);
  };

  getComments = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const comments = await this._commentService.getComments(courseId);
    sendResponse(res, STATUS_CODES.OK, 'Comments fetched', true, comments);
  };

  getReplies = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const replies = await this._commentService.getReplies(commentId);
    sendResponse(res, STATUS_CODES.OK, 'Replies fetched', true, replies);
  };

  deleteComment = async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id;
    const deleted = await this._commentService.deleteComment(commentId, userId!);
    sendResponse(res, STATUS_CODES.OK, 'Comment deleted', true, deleted);
  };

  toggleLike = async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id;
    const updated = await this._commentService.toggleLike(commentId, userId!);
    sendResponse(res, STATUS_CODES.OK, 'Like toggled', true, updated);
  };

  toggleDislike = async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id;
    const updated = await this._commentService.toggleDislike(commentId, userId!);
    sendResponse(res, STATUS_CODES.OK, 'Dislike toggled', true, updated);
  };
}
