import { inject, injectable } from 'inversify';
import { IEmployeeTeacherReviewService } from '../../core/interfaces/services/employee/IEmployeeTeacherReviewService';
import { ITeacherReviewRepository, ITeacherRatingStats } from '../../core/interfaces/repositories/ITeacherReviewRepository';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import mongoose from 'mongoose';
import { ITeacherReview } from '../../models/TeacherReview';

@injectable()
export class EmployeeTeacherReviewService implements IEmployeeTeacherReviewService {

    constructor(
        @inject(TYPES.TeacherReviewRepository)
        private readonly _reviewRepo: ITeacherReviewRepository
    ) { }

    async addReview(employeeId: string, teacherId: string, rating: number, comment: string): Promise<ITeacherReview> {
        const exists = await this._reviewRepo.getReviewByEmployee(teacherId, employeeId);
        if (exists) throwError(MESSAGES.ALREADY_REVIEWED);
        const employeeIdObj = new mongoose.Types.ObjectId(employeeId);
        const teacherIdObj = new mongoose.Types.ObjectId(teacherId);

        return this._reviewRepo.create({
            employeeId: employeeIdObj,
            teacherId: teacherIdObj, rating, comment
        });
    }

    async updateReview(reviewId: string, employeeId: string, data: Partial<ITeacherReview>): Promise<ITeacherReview> {
        const updated = await this._reviewRepo.update(reviewId, data);
        if (!updated) throwError(MESSAGES.REVIEW_NOT_FOUND);

        return updated;
    }

    async deleteReview(reviewId: string, employeeId: string): Promise<void> {
        const deleted = await this._reviewRepo.delete(reviewId);
        if (!deleted) throwError(MESSAGES.REVIEW_NOT_FOUND);
    }

    async getTeacherReviews(teacherId: string): Promise<ITeacherReview[]> {
        return this._reviewRepo.getTeacherReviews(teacherId);
    }

    async getTeacherRatingStats(teacherId: string): Promise<ITeacherRatingStats[]> {
        return this._reviewRepo.getTeacherRatingStats(teacherId);
    }
}
