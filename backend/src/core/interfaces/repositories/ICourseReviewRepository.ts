import { ICourseReview } from "../../../models/CourseReview";

export interface ICourseReviewRepository {
  addReview(data: Partial<ICourseReview>): Promise<ICourseReview>;
  
  findStudentReview(
    studentId: string,
    courseId: string
  ): Promise<ICourseReview | null>;

  updateReview(
    studentId: string,
    courseId: string,
    data: Partial<ICourseReview>
  ): Promise<ICourseReview | null>;

  deleteReview(
    studentId: string,
    reviewId: string
  ): Promise<ICourseReview | null>;

  getReviews(
    courseId: string
  ): Promise<ICourseReview[]>;

  getCourseReviewStats(
    courseId: string
  ): Promise<
    {
      _id: string;
      avgRating: number;
      total: number;
    }[]
  >;
}
