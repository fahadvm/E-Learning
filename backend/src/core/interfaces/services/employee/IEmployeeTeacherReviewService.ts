import { ITeacherReview } from '../../../../models/TeacherReview';
import { ITeacherRatingStats } from '../../repositories/ITeacherReviewRepository';

export interface IEmployeeTeacherReviewService {
    addReview(employeeId: string, teacherId: string, rating: number, comment: string): Promise<ITeacherReview>;
    updateReview(reviewId: string, employeeId: string, data: Partial<ITeacherReview>): Promise<ITeacherReview>;
    deleteReview(reviewId: string, employeeId: string): Promise<void>;
    getTeacherReviews(teacherId: string): Promise<ITeacherReview[]>;
    getTeacherRatingStats(teacherId: string): Promise<ITeacherRatingStats[]>;
}
