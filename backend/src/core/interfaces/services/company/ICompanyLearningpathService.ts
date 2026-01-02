import { IEmployeeLearningPath } from '../../../../models/EmployeeLearningPath';
import { IEmployeeLearningPathProgress } from '../../../../models/EmployeeLearningPathProgress';

export interface ICompanyLearningPathService {
    create(companyId: string, data: Partial<IEmployeeLearningPath>): Promise<IEmployeeLearningPath>;
    getAll(companyId: string): Promise<IEmployeeLearningPath[]>;
    getOne(id: string, companyId: string): Promise<IEmployeeLearningPath | null>;
    update(id: string, companyId: string, data: Partial<IEmployeeLearningPath>): Promise<IEmployeeLearningPath | null>;
    delete(id: string, companyId: string): Promise<void>;
    unassignLearningPath(companyId: string, employeeId: string, learningPathId: string): Promise<void>;
    assignLearningPath(companyId: string, employeeId: string, learningPathId: string): Promise<IEmployeeLearningPathProgress>
    listAssignedLearningPaths(companyId: string, employeeId: string): Promise<IEmployeeLearningPathProgress[]>
    listCompanyLearningPaths(
        companyId: string,
        page: number,
        limit: number,
        search: string,
    ): Promise<{ items: IEmployeeLearningPath[]; total: number; totalPages: number }>


}
