// src/repositories/EmployeeLearningPathRepository.ts
import { injectable } from 'inversify';
import { IEmployeeLearningPathRepository } from '../core/interfaces/repositories/IEmployeeLearningPathRepository';
import { EmployeeLearningPath, IEmployeeLearningPath } from '../models/EmployeeLearningPath';
import { Types } from 'mongoose';

@injectable()
export class EmployeeLearningPathRepository implements IEmployeeLearningPathRepository {
    async create(data: Partial<IEmployeeLearningPath>): Promise<IEmployeeLearningPath> {
        return await EmployeeLearningPath.create(data);
    }

    async findAll(companyId: string): Promise<IEmployeeLearningPath[]> {
        return await EmployeeLearningPath.find({ companyId: new Types.ObjectId(companyId) })
            .sort({ createdAt: -1 })
            .lean()
            .exec() as unknown as IEmployeeLearningPath[];
    }

    async findOneForCompany(companyId: string, learningPathId: string): Promise<IEmployeeLearningPath | null> {
        return await EmployeeLearningPath.findOne({
            _id: new Types.ObjectId(learningPathId),
            companyId: new Types.ObjectId(companyId),
        }).lean().exec() as unknown as IEmployeeLearningPath | null;
    }

    async updateById(id: string, companyId: string, data: Partial<IEmployeeLearningPath>): Promise<IEmployeeLearningPath | null> {
        return await EmployeeLearningPath.findOneAndUpdate(
            { _id: new Types.ObjectId(id), companyId: new Types.ObjectId(companyId) },
            { $set: data },
            { new: true }
        ).lean().exec() as unknown as IEmployeeLearningPath | null;
    }

    async deleteById(id: string, companyId: string): Promise<IEmployeeLearningPath | null> {
        return await EmployeeLearningPath.findOneAndDelete({
            _id: new Types.ObjectId(id),
            companyId: new Types.ObjectId(companyId),
        }).lean().exec() as unknown as IEmployeeLearningPath | null;
    }

    async listByCompany(companyId: string, skip: number, limit: number, search: string): Promise<IEmployeeLearningPath[]> {
        const query: Record<string, unknown> = { companyId: new Types.ObjectId(companyId) };
        if (search) {
            query['$or'] = [
                { title: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ];
        }
        return EmployeeLearningPath.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec();
    }

    async countByCompany(companyId: string, search: string): Promise<number> {
        const query: Record<string, unknown> = { companyId: new Types.ObjectId(companyId) };
        if (search) {
            query['$or'] = [
                { title: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ];
        }
        return EmployeeLearningPath.countDocuments(query).exec();
    }
}
