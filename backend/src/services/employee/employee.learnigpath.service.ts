import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { EmployeeLearningPathProgressRepository } from "../../repositories/EmployeeLearningPathProgressRepository";
import { EmployeeLearningPath } from "../../models/EmployeeLearningPath";
import { throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import mongoose from "mongoose";
import { IEmployeeLearningPathService } from "../../core/interfaces/services/employee/IEmployeeLearningPathService";
import { IEmployeeLearningPathProgressRepository } from "../../core/interfaces/repositories/IEmployeeLearningPathProgressRepository";

@injectable()
export class EmployeeLearningPathService implements IEmployeeLearningPathService{
  constructor(
    @inject(TYPES.EmployeeLearningPathProgressRepository)
    private _learningPathRepo: IEmployeeLearningPathProgressRepository
  ) {}

  async getAssigned(employeeId: string) {
    return this._learningPathRepo.getAssigned(employeeId);
  }

  async getLearningPathDetail(employeeId: string, learningPathId: string) {
    const progress = await this._learningPathRepo.get(employeeId, learningPathId);
    const lp = await EmployeeLearningPath.findById(learningPathId).lean();

    if (!lp) throwError("Learning Path Not Found", STATUS_CODES.NOT_FOUND);

    return { ...lp, progress };
  }

  async updateProgress(employeeId: string, learningPathId: string, completedCourseIndex: number ,courseId:string) {
    const progress = await this._learningPathRepo.get(employeeId, learningPathId);
    if (!progress) throwError("Not Assigned", STATUS_CODES.FORBIDDEN);
    const courseIdObj = new mongoose.Types.ObjectId(courseId)
    // progress.currentCourseIndex = completedCourseIndex + 1;
    progress.completedCourses.push(courseIdObj);

    const total = progress.completedCourses.length;
    const lp = await EmployeeLearningPath.findById(learningPathId);
    progress.percentage = Math.round((total / lp!.courses.length) * 100);

    if (progress.percentage >= 100) progress.status = "completed";

    return progress.save();
  }

  async updateStatus(employeeId: string, learningPathId: string, status: "active" | "paused") {
    const progress = await this._learningPathRepo.get(employeeId, learningPathId);
    if (!progress) throwError("Not Assigned", STATUS_CODES.FORBIDDEN);

    progress.status = status;
    return progress.save();
  }
}
