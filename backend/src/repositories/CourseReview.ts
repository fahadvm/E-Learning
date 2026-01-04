import { injectable } from 'inversify';
import { ICourseReviewRepository } from '../core/interfaces/repositories/ICourseReviewRepository';
import { CourseReview, ICourseReview } from '../models/CourseReview';
import mongoose from 'mongoose';

@injectable()
export class CourseReviewRepository implements ICourseReviewRepository {

  async addReview(data: Partial<ICourseReview>): Promise<ICourseReview> {
    return await CourseReview.create(data);
  }

  async findStudentReview(
    userId: string,
    courseId: string
  ): Promise<ICourseReview | null> {
    return await CourseReview.findOne({ studentId: userId, courseId });
  }

  async findEmployeeReview(
    userId: string,
    courseId: string
  ): Promise<ICourseReview | null> {
    return await CourseReview.findOne({ employeeId: userId, courseId });
  }

  async updateReview(
    userId: string,
    courseId: string,
    data: Partial<ICourseReview>,
    isEmployee: boolean = false
  ): Promise<ICourseReview | null> {
    const query = isEmployee ? { employeeId: userId, courseId } : { studentId: userId, courseId };
    return await CourseReview.findOneAndUpdate(
      query,
      data,
      { new: true }
    );
  }

  async deleteReview(
    userId: string,
    reviewId: string,
    isEmployee: boolean = false
  ): Promise<ICourseReview | null> {
    const query = isEmployee
      ? { _id: reviewId, employeeId: userId }
      : { _id: reviewId, studentId: userId };
    return await CourseReview.findOneAndDelete(query);
  }

  async getReviews(courseId: string): Promise<ICourseReview[]> {
    return await CourseReview.find({ courseId })
      .populate('studentId', 'name profilePicture')
      .populate('employeeId', 'name profilePicture')
      .sort({ createdAt: -1 });
  }

  async getCourseReviewStats(
    courseId: string
  ): Promise<{ _id: string; avgRating: number; total: number }[]> {
    return await CourseReview.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: '$courseId',
          avgRating: { $avg: '$rating' },
          total: { $sum: 1 }
        }
      }
    ]);
  }
}
