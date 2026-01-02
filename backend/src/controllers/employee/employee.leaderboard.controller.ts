import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IEmployeeLeaderboardService } from '../../core/interfaces/services/employee/IEmployeeLeaderboardService';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class EmployeeLeaderboardController {
  constructor(
    @inject(TYPES.EmployeeLeaderboardService)
    private readonly _leaderboardService: IEmployeeLeaderboardService
  ) { }

  async allTime(req: AuthRequest, res: Response) {
    const employeeId = req.user?.id;
    const { companyId } = req.query as { companyId?: string };
    if (!employeeId || !companyId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
    const result = await this._leaderboardService.getAllTimeLeaderboard(employeeId, companyId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.SUCCESS, true, result);
  }

  async weekly(req: AuthRequest, res: Response) {
    const employeeId = req.user?.id;
    const { companyId } = req.query as { companyId?: string }; if (!employeeId || !companyId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
    const result = await this._leaderboardService.getWeeklyLeaderboard(employeeId, companyId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.SUCCESS, true, result);
  }

  async monthly(req: AuthRequest, res: Response) {
    const employeeId = req.user?.id;
    const { companyId } = req.query as { companyId?: string };
    if (!employeeId || !companyId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
    const result = await this._leaderboardService.getMonthlyLeaderboard(employeeId, companyId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.SUCCESS, true, result);
  }
}
