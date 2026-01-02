import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { TYPES } from '../../core/di/types';
import { sendResponse } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { IEmployeeLearningPathService } from '../../core/interfaces/services/employee/IEmployeeLearningPathService';

@injectable()
export class EmployeeLearningPathController {
  constructor(
    @inject(TYPES.EmployeeLearningPathService)
    private readonly _learningPathService: IEmployeeLearningPathService
  ) {}

  async getAssignedPaths(req: AuthRequest, res: Response) {
    const employeeId = req.user!.id;
    const result = await this._learningPathService.getAssigned(employeeId);

    return sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.LEARNING_PATHS_FETCHED,
      true,
      result
    );
  }

  async getLearningPathDetail(req: AuthRequest, res: Response) {
    const employeeId = req.user!.id;
    const { learningPathId } = req.params;

    const result = await this._learningPathService.getLearningPathDetail(
      employeeId,
      learningPathId
    );

    return sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.LEARNING_PATH_DETAILS_FETCHED,
      true,
      result
    );
  }

  async updateProgress(req: AuthRequest, res: Response) {
    const employeeId = req.user!.id;
    const { learningPathId, completedCourseIndex, courseId } = req.body;

    const result = await this._learningPathService.updateProgress(
      employeeId,
      learningPathId,
      completedCourseIndex,
      courseId
    );

    return sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.LEARNING_PATH_PROGRESS_UPDATED,
      true,
      result
    );
  }

  async updateStatus(req: AuthRequest, res: Response) {
    const employeeId = req.user!.id;
    const { learningPathId, status } = req.body;

    const result = await this._learningPathService.updateStatus(
      employeeId,
      learningPathId,
      status
    );

    return sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.LEARNING_PATH_STATUS_UPDATED,
      true,
      result
    );
  }
}
