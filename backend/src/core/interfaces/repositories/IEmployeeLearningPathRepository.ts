import { IEmployeeLearningPath } from '../../../models/EmployeeLearningPath';

export interface IEmployeeLearningPathRepository {
  create(data: Partial<IEmployeeLearningPath>): Promise<IEmployeeLearningPath>;
  findAll(companyId: string): Promise<IEmployeeLearningPath[]>;
  findById(id: string, companyId: string): Promise<IEmployeeLearningPath | null>;
  updateById(id: string, companyId: string, data: Partial<IEmployeeLearningPath>): Promise<IEmployeeLearningPath | null>;
  deleteById(id: string, companyId: string): Promise<IEmployeeLearningPath | null>;
}
