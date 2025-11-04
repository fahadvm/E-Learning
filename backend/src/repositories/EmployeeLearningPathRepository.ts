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

  async findById(id: string, companyId: string): Promise<IEmployeeLearningPath | null> {
    return await EmployeeLearningPath.findOne({
      _id: new Types.ObjectId(id),
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
}
