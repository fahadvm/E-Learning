import mongoose from 'mongoose';
import { IEmployeeLearningPathProgress } from '../../../models/EmployeeLearningPathProgress';

export interface IEmployeeLearningPathProgressRepository {
  findAssigned(
    companyId: string,
    employeeId: string
  ): Promise<IEmployeeLearningPathProgress[]>;

  getAssigned(
    employeeId: string
  ): Promise<IEmployeeLearningPathProgress[]>;

  findOne(
    companyId: string,
    employeeId: string,
    learningPathId: string
  ): Promise<IEmployeeLearningPathProgress | null>;

  create(
    companyId: string,
    employeeId: string,
    learningPathId: string
  ): Promise<IEmployeeLearningPathProgress>;

  delete(
    companyId: string,
    employeeId: string,
    learningPathId: string
  ): Promise<void>;

  get(
    employeeId: string,
    learningPathId: string
  ): Promise<IEmployeeLearningPathProgress | null>;

  updateLearningPathProgress(employeeId: string, courseId: string, percentage: number): Promise<IEmployeeLearningPathProgress>

  countAssignedSeats(companyId: string, courseId: string): Promise<number>;
  findAllAssignedEmployees(companyId: string, learningPathId: string): Promise<{ employeeId: mongoose.Types.ObjectId }[]>;
  findByEmployeeId(employeeId: string): Promise<IEmployeeLearningPathProgress | null>;

}
