// src/services/company/CompanyLearningPathService.ts
import { inject, injectable } from 'inversify';
import { ICompanyLearningPathService } from '../../core/interfaces/services/company/ICompanyLearningpathService';
import { IEmployeeLearningPath } from '../../models/EmployeeLearningPath';
import { IEmployeeLearningPathRepository } from '../../core/interfaces/repositories/IEmployeeLearningPathRepository';
import { TYPES } from '../../core/di/types';
import mongoose from 'mongoose';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { throwError } from '../../utils/ResANDError';
import { IEmployeeLearningPathProgressRepository } from '../../core/interfaces/repositories/IEmployeeLearningPathProgressRepository';
import { IEmployeeLearningPathProgress } from '../../models/EmployeeLearningPathProgress';
import { ICompanyCoursePurchaseRepository } from '../../core/interfaces/repositories/ICompanyCoursePurchaseRepository';
import { INotificationService } from '../../core/interfaces/services/shared/INotificationService';
import { ICompanyRepository } from '../../core/interfaces/repositories/ICompanyRepository';

@injectable()
export class CompanyLearningPathService implements ICompanyLearningPathService {
    constructor(
        @inject(TYPES.EmployeeLearningPathRepository) private readonly _repo: IEmployeeLearningPathRepository,
        @inject(TYPES.EmployeeLearningPathProgressRepository) private readonly _assignRepo: IEmployeeLearningPathProgressRepository,
        @inject(TYPES.CompanyCoursePurchaseRepository) private readonly _purchaseRepo: ICompanyCoursePurchaseRepository,
        @inject(TYPES.NotificationService) private readonly _notificationService: INotificationService,
        @inject(TYPES.CompanyRepository) private readonly _companyRepo: ICompanyRepository

    ) { }

    async create(companyId: string, data: Partial<IEmployeeLearningPath>) {
        if (!data.title || !data.category || !data.difficulty) {
            throwError(MESSAGES.INVALID_DATA, STATUS_CODES.BAD_REQUEST);
        }

        const courses = (data.courses || []).map((c, idx) => ({
            ...c,
            order: idx,
            locked: idx !== 0,
        }));

        return await this._repo.create({
            ...data,
            companyId: new mongoose.Types.ObjectId(companyId),
            courses,
        });
    }

    async getAll(companyId: string) {
        return await this._repo.findAll(companyId);
    }

    async getOne(id: string, companyId: string) {
        const lp = await this._repo.findOneForCompany(companyId, id);
        if (!lp) throwError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
        return lp;
    }

    async update(id: string, companyId: string, data: Partial<IEmployeeLearningPath>) {
        // re-apply locking/order if courses provided
        if (data.courses && data.courses.length) {
            data.courses = data.courses.map((c, idx) => ({
                ...c,
                order: typeof c.order === 'number' ? c.order : idx,
                locked: idx !== 0,
            }));
        }

        const updated = await this._repo.updateById(id, companyId, data);
        if (!updated) throwError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
        return updated;
    }

    async delete(id: string, companyId: string) {
        const lp = await this._repo.findOneForCompany(companyId, id);
        if (!lp) throwError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

        // Find all employees assigned to this learning path
        const assignments = await this._assignRepo.findAllAssignedEmployees(companyId, id);

        //  Decrease seat usage for each employee
        for (const a of assignments) {
            for (const course of lp.courses) {
                await this._purchaseRepo.decreaseSeatUsage(
                    new mongoose.Types.ObjectId(companyId),
                    new mongoose.Types.ObjectId(course.courseId.toString())
                );
            }

            await this._assignRepo.delete(companyId, a.employeeId.toString(), id);
        }

        const deleted = await this._repo.deleteById(id, companyId);
        if (!deleted) throwError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    async listCompanyLearningPaths(
        companyId: string,
        page: number,
        limit: number,
        search: string = ""
    ): Promise<{ items: IEmployeeLearningPath[]; total: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this._repo.listByCompany(companyId, skip, limit, search),
            this._repo.countByCompany(companyId, search),
        ]);
        return { items, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
    }

    async listAssignedLearningPaths(companyId: string, employeeId: string): Promise<any[]> {
        const assigned = await this._assignRepo.findAssigned(companyId, employeeId);
        return assigned;
    }

    async assignLearningPath(companyId: string, employeeId: string, learningPathId: string): Promise<IEmployeeLearningPathProgress> {
        const lp = await this._repo.findOneForCompany(companyId, learningPathId);
        if (!lp) throwError(MESSAGES.LEARNING_PATH_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        // prevent duplicates
        const exists = await this._assignRepo.findOne(companyId, employeeId, learningPathId);
        if (exists) throwError(MESSAGES.LEARNING_PATH_ALREADY_ASSIGNED, STATUS_CODES.BAD_REQUEST);

        // Check seat availability for all courses in the learning path
        const seatCheckResults = await this.checkLearningPathSeats(companyId, lp);
        console.log("seatCheckResults", seatCheckResults)

        // If any course has insufficient seats, throw error with details
        const insufficientSeats = seatCheckResults.filter(result => result.remaining <= 0);
        if (insufficientSeats.length > 0) {
            const courseNames = insufficientSeats.map(r => r.courseName).join(', ');
            throwError(
                `Cannot assign learning path. The following courses have no available seats: ${courseNames}. Please purchase more seats.`,
                STATUS_CODES.BAD_REQUEST
            );
        }

        // Create progress with sequential rule (Option B): first course index = 0; UI locks others based on index
        const progress = await this._assignRepo.create(companyId, employeeId, learningPathId);

        const company = await this._companyRepo.findById(companyId);

        // Notify Employee
        await this._notificationService.createNotification(
            employeeId,
            'New Learning Path Assigned',
            `You have been assigned to the learning path: ${lp.title}.`,
            'learning-path',
            'employee',
            `/employee/learning-paths`
        );

        for (const course of lp.courses) {
            await this._purchaseRepo.increaseSeatUsage(
                new mongoose.Types.ObjectId(companyId),
                new mongoose.Types.ObjectId(course.courseId.toString())
            );

            // Check if seat limit reached for this course
            const results = await this.checkLearningPathSeats(companyId, lp);
            const thisCourseResult = results.find(r => r.courseId.toString() === course.courseId.toString());

            if (thisCourseResult && thisCourseResult.remaining <= 0) {
                await this._notificationService.createNotification(
                    companyId,
                    'Seat Limit Reached',
                    `Course "${course.title}" has reached its seat limit. Please buy more seats.`,
                    'seat-limit',
                    'company',
                    '/company/courses'
                );
            }
        }

        // Notify Company
        await this._notificationService.createNotification(
            companyId,
            'Learning Path Assigned',
            `${lp.title} has been assigned to an employee.`,
            'learning-path',
            'company',
            `/company/employees/${employeeId}`
        );

        return progress;
    }

    private async checkLearningPathSeats(companyId: string, learningPath: IEmployeeLearningPath) {
        const { CompanyOrderModel } = await import('../../models/CompanyOrder');
        const results = [];

        for (const course of learningPath.courses) {
            // Get total purchased seats for this course
            const orders = await CompanyOrderModel.find({
                companyId: new mongoose.Types.ObjectId(companyId),
                status: 'paid',
                'purchasedCourses.courseId': course.courseId
            });

            const totalSeats = orders.reduce((sum, order) => {
                const purchasedCourse = order.purchasedCourses.find(
                    pc => pc.courseId.toString() === course.courseId.toString()
                );
                return sum + (purchasedCourse?.seats || 0);
            }, 0);
            console.log("totalSeats:", totalSeats)

            // Get assigned seats - count unique employees who have this course in any learning path
            const assignedSeats = await this._assignRepo.countAssignedSeats(companyId, course.courseId.toString());

            results.push({
                courseId: course.courseId,
                courseName: course.title,
                totalSeats,
                assignedSeats,
                remaining: totalSeats - assignedSeats
            });
        }

        return results;
    }

    async unassignLearningPath(companyId: string, employeeId: string, learningPathId: string): Promise<void> {
        console.log(companyId, employeeId, learningPathId)
        const exists = await this._assignRepo.findOne(companyId, employeeId, learningPathId);
        if (!exists) throwError(MESSAGES.LEARNING_PATH_ASSIGNMENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        await this._assignRepo.delete(companyId, employeeId, learningPathId);
        const lp = await this._repo.findOneForCompany(companyId, learningPathId);
        if (!lp) throwError(MESSAGES.LEARNING_PATH_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        // Notify Employee
        await this._notificationService.createNotification(
            employeeId,
            'Learning Path Removed',
            `The learning path "${lp.title}" has been unassigned from your account.`,
            'learning-path',
            'employee'
        );

        // Notify Company
        await this._notificationService.createNotification(
            companyId,
            'Learning Path Unassigned',
            `Learning path "${lp.title}" has been unassigned from an employee.`,
            'learning-path',
            'company'
        );

        for (const course of lp.courses) {
            await this._purchaseRepo.decreaseSeatUsage(
                new mongoose.Types.ObjectId(companyId),
                new mongoose.Types.ObjectId(course.courseId.toString())
            );
        }
    }



}
