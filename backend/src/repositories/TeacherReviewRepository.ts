import { injectable } from 'inversify';
import TeacherReviewModel, { ITeacherReview } from '../models/TeacherReview';
import mongoose from 'mongoose';
import { ITeacherReviewRepository, ITeacherRatingStats } from '../core/interfaces/repositories/ITeacherReviewRepository';

@injectable()
export class TeacherReviewRepository implements ITeacherReviewRepository {

  async create(data: Partial<ITeacherReview>): Promise<ITeacherReview> {
    return await TeacherReviewModel.create(data);
  }

  async update(id: string, data: Partial<ITeacherReview>): Promise<ITeacherReview | null> {
    return await TeacherReviewModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<ITeacherReview | null> {
    return await TeacherReviewModel.findByIdAndDelete(id);
  }

  async getTeacherReviews(teacherId: string): Promise<ITeacherReview[]> {
    return await TeacherReviewModel.find({ teacherId })
      .populate('studentId', 'name profilePicture')
      .populate('employeeId', 'name profilePicture')
      .sort({ createdAt: -1 });
  }

  async getReviewByStudent(teacherId: string, studentId: string): Promise<ITeacherReview | null> {
    return await TeacherReviewModel.findOne({ teacherId, studentId });
  }

  async getReviewByEmployee(teacherId: string, employeeId: string): Promise<ITeacherReview | null> {
    return await TeacherReviewModel.findOne({ teacherId, employeeId });
  }

  async getTeacherRatingStats(teacherId: string): Promise<ITeacherRatingStats[]> {
    return TeacherReviewModel.aggregate([
      { $match: { teacherId: new mongoose.Types.ObjectId(teacherId) } },
      {
        $group: {
          _id: '$teacherId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
  }
}
