import { ICourseReview } from '../../../../models/CourseReview';

export interface IEmployeeCourseReviewService {
    addOrUpdateReview(
        employeeId: string,
        courseId: string,
        rating: number,
        comment: string
    ): Promise<ICourseReview>;

    deleteReview(
        employeeId: string,
        reviewId: string
    ): Promise<void>;

    getCourseReviews(
        courseId: string
    ): Promise<ICourseReview[]>;
}
