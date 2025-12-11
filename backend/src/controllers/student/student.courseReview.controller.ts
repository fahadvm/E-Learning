import { Response } from "express";
import { inject, injectable } from "inversify";
import { StudentCourseReviewService } from "../../services/student/student.courseReview.service";
import { TYPES } from "../../core/di/types";
import { AuthRequest } from "../../types/AuthenticatedRequest";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";

@injectable()
export class StudentCourseReviewController {
  constructor(
    @inject(TYPES.StudentCourseReviewService)
    private readonly _reviewService: StudentCourseReviewService
  ) {}

  addReview = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    const { courseId, rating, comment }: { courseId: string; rating: number; comment?: string } = req.body;

    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    if (!rating || !courseId ||!comment ) throwError(MESSAGES.RATING_COURSE_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const review = await this._reviewService.addOrUpdateReview(studentId, courseId, rating, comment);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_REVIEW_SAVED, true, review);
  };

  getReviews = async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params as { courseId: string };

    if (!courseId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const reviews = await this._reviewService.getCourseReviews(courseId);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_REVIEWS_FETCHED, true, reviews);
  };

  deleteReview = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    const { reviewId } = req.params as { reviewId: string };

    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    if (!reviewId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    await this._reviewService.deleteReview(studentId, reviewId);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_REVIEW_DELETED, true);
  };
}
