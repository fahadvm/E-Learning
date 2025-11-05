import { IEmployeeLearningPathProgress } from "../../../models/EmployeeLearningPathProgress";

export interface IEmployeeLearningPathProgressRepository {
  findAssigned(companyId: string, employeeId: string): Promise<IEmployeeLearningPathProgress[]>;
  findOne(companyId: string, employeeId: string, learningPathId: string): Promise<IEmployeeLearningPathProgress | null>;
  create(companyId: string, employeeId: string, learningPathId: string): Promise<IEmployeeLearningPathProgress>;
  delete(companyId: string, employeeId: string, learningPathId: string): Promise<void>;
}
