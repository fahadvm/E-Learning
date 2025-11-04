import { IEmployeeLearningPath } from '../../../../models/EmployeeLearningPath';

export interface ICompanyLearningPathService {
  create(companyId: string, data: Partial<IEmployeeLearningPath>): Promise<IEmployeeLearningPath>;
  getAll(companyId: string): Promise<IEmployeeLearningPath[]>;
  getOne(id: string, companyId: string): Promise<IEmployeeLearningPath | null>;
  update(id: string, companyId: string, data: Partial<IEmployeeLearningPath>): Promise<IEmployeeLearningPath | null>;
  delete(id: string, companyId: string): Promise<void>;
}
