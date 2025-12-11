import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { ITeacherEarningsController } from '../../core/interfaces/controllers/teacher/ITeacherEarningsController';
import { ITeacherEarningsService } from '../../core/interfaces/services/teacher/ITeacherEarningsService';
import { TYPES } from '../../core/di/types';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class TeacherEarningsController implements ITeacherEarningsController {
  constructor(
    @inject(TYPES.TeacherEarningsService)
    private readonly _earningsService: ITeacherEarningsService
  ) {}

  async getEarningsHistory(req: AuthRequest, res: Response): Promise<void> {
    const teacherId = req.user?.id;
    if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const type = req.query.type as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const result = await this._earningsService.getEarningsHistory(teacherId, {
      page,
      limit,
      type,
      startDate,
      endDate
    });

    sendResponse(res, STATUS_CODES.OK, MESSAGES.EARNINGS_HISTORY_FETCHED, true, result);
  }

  async getEarningsStats(req: AuthRequest, res: Response): Promise<void> {
    const teacherId = req.user?.id;
    if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const stats = await this._earningsService.getEarningsStats(teacherId);

    sendResponse(res, STATUS_CODES.OK, MESSAGES.EARNINGS_STATS_FETCHED, true, stats);
  }
}
