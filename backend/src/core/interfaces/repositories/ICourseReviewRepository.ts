import { ICourseReview } from '../../../models/CourseReview';

export interface ICourseReviewRepository {
  addReview(data: Partial<ICourseReview>): Promise<ICourseReview>;

  findStudentReview(
    userId: string,
    courseId: string
  ): Promise<ICourseReview | null>;

  findEmployeeReview(
    userId: string,
    courseId: string
  ): Promise<ICourseReview | null>;

  updateReview(
    userId: string,
    courseId: string,
    data: Partial<ICourseReview>,
    isEmployee?: boolean
  ): Promise<ICourseReview | null>;

  deleteReview(
    userId: string,
    reviewId: string,
    isEmployee?: boolean
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
