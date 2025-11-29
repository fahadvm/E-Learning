import { injectable } from "inversify";
import { ICourseReviewRepository } from "../core/interfaces/repositories/ICourseReviewRepository";
import { CourseReview, ICourseReview } from "../models/CourseReview";

@injectable()
export class CourseReviewRepository implements ICourseReviewRepository {
  
  async addReview(data: Partial<ICourseReview>): Promise<ICourseReview> {
    return await CourseReview.create(data);
  }

  async findStudentReview(
    studentId: string,
    courseId: string
  ): Promise<ICourseReview | null> {
    return await CourseReview.findOne({ studentId, courseId });
  }

  async updateReview(
    studentId: string,
    courseId: string,
    data: Partial<ICourseReview>
  ): Promise<ICourseReview | null> {
    return await CourseReview.findOneAndUpdate(
      { studentId, courseId },
      data,
      { new: true }
    );
  }

  async deleteReview(
    studentId: string,
    reviewId: string
  ): Promise<ICourseReview | null> {
    return await CourseReview.findOneAndDelete({ _id: reviewId, studentId });
  }

  async getReviews(courseId: string): Promise<ICourseReview[]> {
    return await CourseReview.find({ courseId })
      .populate("studentId", "name profilePicture")
      .sort({ createdAt: -1 });
  }

  async getCourseReviewStats(
    courseId: string
  ): Promise<{ _id: string; avgRating: number; total: number }[]> {
    return await CourseReview.aggregate([
      { $match: { courseId } },
      {
        $group: {
          _id: "$courseId",
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 }
        }
      }
    ]);
  }
}
