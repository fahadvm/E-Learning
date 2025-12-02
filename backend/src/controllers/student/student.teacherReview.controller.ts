import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { AuthRequest } from "../../types/AuthenticatedRequest";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { MESSAGES } from "../../utils/ResponseMessages";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { IStudentTeacherReviewService } from "../../core/interfaces/services/student/IStudentTeacherReviewService";

@injectable()
export class StudentTeacherReviewController {

  constructor(
    @inject(TYPES.StudentTeacherReviewService)
    private readonly _reviewService: IStudentTeacherReviewService
  ) {}

  addReview = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { teacherId, rating, comment } = req.body;
    const review = await this._reviewService.addReview(studentId, teacherId, rating, comment);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.REVIEW_ADDED, true, review);
  };

  updateReview = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    const { reviewId } = req.params;

    const updated = await this._reviewService.updateReview(reviewId, studentId!, req.body);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.REVIEW_UPDATED, true, updated);
  };

  deleteReview = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    const { reviewId } = req.params;

    await this._reviewService.deleteReview(reviewId, studentId!);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.REVIEW_DELETED, true, null);
  };

  getTeacherReviews = async (req: AuthRequest, res: Response) => {
    const { teacherId } = req.params;

    const reviews = await this._reviewService.getTeacherReviews(teacherId);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.REVIEW_LIST_FETCHED, true, reviews);
  };

  getRatingStats = async (req: AuthRequest, res: Response) => {
    const { teacherId } = req.params;

    const stats = await this._reviewService.getTeacherRatingStats(teacherId);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.RATING_STATS_FETCHED, true, stats);
  };
}
