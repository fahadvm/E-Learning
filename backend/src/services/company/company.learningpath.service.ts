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

@injectable()
export class CompanyLearningPathService implements ICompanyLearningPathService {
    constructor(
        @inject(TYPES.EmployeeLearningPathRepository)private readonly _repo: IEmployeeLearningPathRepository,
        @inject(TYPES.EmployeeLearningPathProgressRepository)private readonly _assignRepo: IEmployeeLearningPathProgressRepository
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
        const lp = await this._repo.findOneForCompany( companyId,id);
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

    async listAssignedLearningPaths(companyId: string, employeeId: string): Promise<IEmployeeLearningPath[]> {
        const assigned = await this._assignRepo.findAssigned(companyId, employeeId);
        return assigned
            .map((p: any) => p.learningPathId)
            .filter(Boolean);
    }

    async assignLearningPath(companyId: string, employeeId: string, learningPathId: string): Promise<IEmployeeLearningPathProgress> {
        const lp = await this._repo.findOneForCompany(companyId, learningPathId);
        if (!lp) throwError(MESSAGES.LEARNING_PATH_NOT_FOUND , STATUS_CODES.NOT_FOUND);

        // prevent duplicates
        const exists = await this._assignRepo.findOne(companyId, employeeId, learningPathId);
        if (exists) throwError(MESSAGES.LEARNING_PATH_ALREADY_ASSIGNED , STATUS_CODES.BAD_REQUEST);

        // Create progress with sequential rule (Option B): first course index = 0; UI locks others based on index
        const progress = await this._assignRepo.create(companyId, employeeId, learningPathId);
        return progress;
    }

    async unassignLearningPath(companyId: string, employeeId: string, learningPathId: string): Promise<void> {
        console.log(companyId , employeeId, learningPathId)
        const exists = await this._assignRepo.findOne(companyId, employeeId, learningPathId);
        if (!exists) throwError(MESSAGES.LEARNING_PATH_ASSIGNMENT_NOT_FOUND , STATUS_CODES.NOT_FOUND);

        await this._assignRepo.delete(companyId, employeeId, learningPathId);
    }



}
