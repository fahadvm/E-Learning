import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { ICourseReviewRepository } from '../../core/interfaces/repositories/ICourseReviewRepository';
import { IStudentCourseReviewService } from '../../core/interfaces/services/student/IStudentCourseReviewService';
import { ICourseReview } from '../../models/CourseReview';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import mongoose from 'mongoose';

@injectable()
export class StudentCourseReviewService implements IStudentCourseReviewService {
    constructor(
        @inject(TYPES.CourseReviewRepository)
        private readonly _reviewRepo: ICourseReviewRepository,

        @inject(TYPES.CourseRepository)
        private readonly _courseRepo: ICourseRepository
    ) { }

    async addOrUpdateReview(
        studentId: string,
        courseId: string,
        rating: number,
        comment: string
    ): Promise<ICourseReview> {

        const existing = await this._reviewRepo.findStudentReview(studentId, courseId);

        let review: ICourseReview;
        const studentIdObj = new mongoose.Types.ObjectId(studentId);
        const courseIdObj = new mongoose.Types.ObjectId(courseId);


        if (existing) {
            review = await this._reviewRepo.updateReview(studentId, courseId, {
                rating,
                comment,
            }) as ICourseReview;
        } else {
            review = await this._reviewRepo.addReview({
                studentId :studentIdObj,
                courseId :courseIdObj,
                rating,
                comment,
            });
        }

        await this.updateCourseStats(courseId);
        return review;
    }

    async deleteReview(studentId: string, reviewId: string): Promise<void> {
        await this._reviewRepo.deleteReview(studentId, reviewId);
        return;
    }

    async getCourseReviews(courseId: string): Promise<ICourseReview[]> {
        return await this._reviewRepo.getReviews(courseId);
    }

    private async updateCourseStats(courseId: string): Promise<void> {
        const stats = await this._reviewRepo.getCourseReviewStats(courseId);

        const avgRating = stats[0]?.avgRating || 0;
        const reviewCount = stats[0]?.total || 0;

        await this._courseRepo.updateStatus(courseId, {
            averageRating: avgRating,
            reviewCount: reviewCount,
        });
    }
}
