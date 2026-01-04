import { ITeacherReview } from '../../../models/TeacherReview';

export interface ITeacherRatingStats {
  _id: string;
  averageRating: number;
  totalReviews: number;
}

export interface ITeacherReviewRepository {
  create(data: Partial<ITeacherReview>): Promise<ITeacherReview>;
  update(id: string, data: Partial<ITeacherReview>): Promise<ITeacherReview | null>;
  delete(id: string): Promise<ITeacherReview | null>;
  getTeacherReviews(teacherId: string): Promise<ITeacherReview[]>;
  getReviewByStudent(teacherId: string, studentId: string): Promise<ITeacherReview | null>;
  getReviewByEmployee(teacherId: string, employeeId: string): Promise<ITeacherReview | null>;
  getTeacherRatingStats(teacherId: string): Promise<ITeacherRatingStats[]>;
}
