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

@injectable()
export class CompanyLearningPathService implements ICompanyLearningPathService {
  constructor(
    @inject(TYPES.EmployeeLearningPathRepository)
    private readonly _repo: IEmployeeLearningPathRepository
  ) {}

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
    const lp = await this._repo.findById(id, companyId);
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
}
