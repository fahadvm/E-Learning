import { inject, injectable } from "inversify";
import { Response } from "express";
import { AuthRequest } from "../../types/AuthenticatedRequest";
import { TYPES } from "../../core/di/types";
import { EmployeeLearningPathService } from "../../services/employee/employee.learnigpath.service";
import { sendResponse } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { IEmployeeLearningPathService } from "../../core/interfaces/services/employee/IEmployeeLearningPathService";

@injectable()
export class EmployeeLearningPathController {
  constructor(
    @inject(TYPES.EmployeeLearningPathService)
    private _learningPathService: IEmployeeLearningPathService
  ) {}

  async getAssignedPaths(req: AuthRequest, res: Response) {
    const employeeId = req.user!.id;
    const result = await this._learningPathService.getAssigned(employeeId);
    console.log("assingned result",result)
    sendResponse(res, STATUS_CODES.OK, "Assigned learning paths fetched", true, result);
  }

  async getLearningPathDetail(req: AuthRequest, res: Response) {
    const employeeId = req.user!.id;
    const { learningPathId } = req.params;
    const result = await this._learningPathService.getLearningPathDetail(employeeId, learningPathId);
    sendResponse(res, STATUS_CODES.OK, "Learning path details fetched", true, result);
  }

  async updateProgress(req: AuthRequest, res: Response) {
    const employeeId = req.user!.id;
    const { learningPathId, completedCourseIndex ,courseId} = req.body;
    const result = await this._learningPathService.updateProgress(employeeId, learningPathId, completedCourseIndex ,courseId);
    sendResponse(res, STATUS_CODES.OK, "Progress updated", true, result);
  }

  async updateStatus(req: AuthRequest, res: Response) {
    const employeeId = req.user!.id;
    const { learningPathId, status } = req.body;
    const result = await this._learningPathService.updateStatus(employeeId, learningPathId, status);
    sendResponse(res, STATUS_CODES.OK, "Status updated", true, result);
  }
}
