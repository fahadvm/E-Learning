import { ICourseReview } from "../../../../models/CourseReview";

export interface IStudentCourseReviewService {
  addOrUpdateReview(
    studentId: string,
    courseId: string,
    rating: number,
    comment: string
  ): Promise<ICourseReview>;

  deleteReview(
    studentId: string,
    reviewId: string
  ): Promise<void>;

  getCourseReviews(
    courseId: string
  ): Promise<ICourseReview[]>;
}
