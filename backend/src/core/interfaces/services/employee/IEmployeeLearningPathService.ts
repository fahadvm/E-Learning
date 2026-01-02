import { IEmployeeLearningPath } from '../../../../models/EmployeeLearningPath';
import { IEmployeeLearningPathProgress } from '../../../../models/EmployeeLearningPathProgress';

export interface ILearningPathDetail extends Partial<IEmployeeLearningPath> {
  progress: IEmployeeLearningPathProgress | null;
}

export interface IEmployeeLearningPathService {
  getAssigned(employeeId: string): Promise<IEmployeeLearningPathProgress[]>;

  getLearningPathDetail(
    employeeId: string,
    learningPathId: string
  ): Promise<ILearningPathDetail>;

  updateProgress(
    employeeId: string,
    learningPathId: string,
    completedCourseIndex: number,
    courseId: string
  ): Promise<IEmployeeLearningPathProgress>;

  updateStatus(
    employeeId: string,
    learningPathId: string,
    status: 'active' | 'paused'
  ): Promise<IEmployeeLearningPathProgress>;
}
