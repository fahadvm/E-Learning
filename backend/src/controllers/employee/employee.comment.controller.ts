import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/di/types';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { sendResponse } from '../../utils/ResANDError';
import { Types } from 'mongoose';
import { IEmployeeCommentService } from '../../core/interfaces/services/employee/IEmployeeCommentService';

@injectable()
export class EmployeeCommentController {
  constructor(@inject(TYPES.EmployeeCommentService) private _commentService: IEmployeeCommentService) {}

  addComment = async (req: AuthRequest, res: Response) => {
    const { content } = req.body;
    const {courseId} = req.params;
    const userId = req.user?.id;

    const comment = await this._commentService.addComment({ courseId : new Types.ObjectId(courseId), userId:new Types.ObjectId(userId), content });
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, comment);
  };

  getComments = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const comments = await this._commentService.getComments(courseId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, comments);
  };

  deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const deleted = await this._commentService.deleteComment(commentId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, deleted);
  };
}
