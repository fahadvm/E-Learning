// src/core/interfaces/services/employee/IEmployeeLearningPathService.ts

export interface IEmployeeLearningPathService {
  getAssigned(employeeId: string): Promise<any>;

  getLearningPathDetail(
    employeeId: string,
    learningPathId: string
  ): Promise<any>;

  updateProgress(
    employeeId: string,
    learningPathId: string,
    completedCourseIndex: number,
    courseId: string
  ): Promise<any>;

  updateStatus(
    employeeId: string,
    learningPathId: string,
    status: "active" | "paused"
  ): Promise<any>;
}
