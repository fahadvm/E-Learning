import { ITeacherReview } from "../../../../models/TeacherReview";

export interface IStudentTeacherReviewService {
  addReview(studentId: string, teacherId: string, rating: number, comment: string): Promise<ITeacherReview>;
  updateReview(reviewId: string, studentId: string, data: any): Promise<ITeacherReview>;
  deleteReview(reviewId: string, studentId: string): Promise<void>;
  getTeacherReviews(teacherId: string): Promise<ITeacherReview[]>;
  getTeacherRatingStats(teacherId: string): Promise<any>;
}
