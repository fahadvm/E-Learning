import { Response } from "express";
import { inject, injectable } from "inversify";
import { StudentCourseReviewService } from "../../services/student/student.courseReview.service";
import { TYPES } from "../../core/di/types";
import { AuthRequest } from "../../types/AuthenticatedRequest";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";

@injectable()
export class StudentCourseReviewController {

  constructor(
    @inject(TYPES.StudentCourseReviewService)
    private readonly _reviewService: StudentCourseReviewService
  ) {}

  addReview = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    const { courseId, rating, comment } = req.body;

    if (!rating || !courseId) throwError("Rating and Course ID required");

    const review = await this._reviewService.addOrUpdateReview(
      studentId!,
      courseId,
      rating,
      comment
    );

    return sendResponse(res, STATUS_CODES.OK, "Course review saved", true, review);
  };

  getReviews = async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;

    const reviews = await this._reviewService.getCourseReviews(courseId);
    return sendResponse(res, STATUS_CODES.OK, "Course reviews fetched", true, reviews);
  };

  deleteReview = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    const { reviewId } = req.params;

    await this._reviewService.deleteReview(studentId!, reviewId);

    return sendResponse(res, STATUS_CODES.OK, "Course review deleted", true);
  };
}
