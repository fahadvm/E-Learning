import { IEmployeeLearningPath } from '../../../models/EmployeeLearningPath';

export interface IEmployeeLearningPathRepository {
    create(data: Partial<IEmployeeLearningPath>): Promise<IEmployeeLearningPath>;
    findAll(companyId: string): Promise<IEmployeeLearningPath[]>;
    findOneForCompany(companyId: string, learningPathId: string): Promise<IEmployeeLearningPath | null>; findOneForCompany(id: string, companyId: string): Promise<IEmployeeLearningPath | null>;
    updateById(id: string, companyId: string, data: Partial<IEmployeeLearningPath>): Promise<IEmployeeLearningPath | null>;
    deleteById(id: string, companyId: string): Promise<IEmployeeLearningPath | null>;
    listByCompany(companyId: string, skip: number, limit: number, search: string): Promise<IEmployeeLearningPath[]>;
    countByCompany(companyId: string, search: string): Promise<number>;
}
