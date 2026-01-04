import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { ICourseReviewRepository } from '../../core/interfaces/repositories/ICourseReviewRepository';
import { IEmployeeCourseReviewService } from '../../core/interfaces/services/employee/IEmployeeCourseReviewService';
import { ICourseReview } from '../../models/CourseReview';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import mongoose from 'mongoose';

@injectable()
export class EmployeeCourseReviewService implements IEmployeeCourseReviewService {
    constructor(
        @inject(TYPES.CourseReviewRepository)
        private readonly _reviewRepo: ICourseReviewRepository,

        @inject(TYPES.CourseRepository)
        private readonly _courseRepo: ICourseRepository
    ) { }

    async addOrUpdateReview(
        employeeId: string,
        courseId: string,
        rating: number,
        comment: string
    ): Promise<ICourseReview> {

        const existing = await this._reviewRepo.findEmployeeReview(employeeId, courseId);

        let review: ICourseReview;
        const employeeIdObj = new mongoose.Types.ObjectId(employeeId);
        const courseIdObj = new mongoose.Types.ObjectId(courseId);


        if (existing) {
            review = await this._reviewRepo.updateReview(employeeId, courseId, {
                rating,
                comment,
            }, true) as ICourseReview;
        } else {
            review = await this._reviewRepo.addReview({
                employeeId: employeeIdObj,
                courseId: courseIdObj,
                rating,
                comment,
            });
        }

        await this.updateCourseStats(courseId);
        return review;
    }

    async deleteReview(employeeId: string, reviewId: string): Promise<void> {
        const deletedReview = await this._reviewRepo.deleteReview(employeeId, reviewId, true);
        if (deletedReview) {
            await this.updateCourseStats(deletedReview.courseId.toString());
        }
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
