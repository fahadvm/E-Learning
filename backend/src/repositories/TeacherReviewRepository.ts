import { injectable } from "inversify";
import TeacherReviewModel from "../models/TeacherReview";
import mongoose from "mongoose";
import { ITeacherReviewRepository } from "../core/interfaces/repositories/ITeacherReviewRepository";

@injectable()
export class TeacherReviewRepository implements ITeacherReviewRepository {
  
  async create(data:any) {
    return await TeacherReviewModel.create(data);
  }

  async update(id: string, data: any) {
    return await TeacherReviewModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await TeacherReviewModel.findByIdAndDelete(id);
  }

  async getTeacherReviews(teacherId: string) {
    return await TeacherReviewModel.find({ teacherId })
      .populate("studentId", "name profilePicture")
      .sort({ createdAt: -1 });
  }

  async getReviewByStudent(teacherId: string, studentId: string) {
    return await TeacherReviewModel.findOne({ teacherId, studentId });
  }

  async getTeacherRatingStats(teacherId: string) {
    return TeacherReviewModel.aggregate([
      { $match: { teacherId: new mongoose.Types.ObjectId(teacherId) } },
      {
        $group: {
          _id: "$teacherId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
  }
}
