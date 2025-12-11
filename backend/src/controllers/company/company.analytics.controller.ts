import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { decodeToken } from '../../utils/JWTtoken';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { CompanyAnalyticsService } from '../../services/company/company.analytics.service';

@injectable()
export class CompanyAnalyticsController {
    constructor(
        @inject(TYPES.CompanyAnalyticsService) private readonly _analyticsService: CompanyAnalyticsService
    ) { }

    async getTrackerStats(req: Request, res: Response): Promise<void> {
        const decoded = decodeToken(req.cookies.token);
        if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

        const { range } = req.query;
        const validRanges = ['week', 'month', 'year'];

        if (!range || !validRanges.includes(range as string)) {
            throwError(MESSAGES.INVALID_RANGES, STATUS_CODES.BAD_REQUEST);
        }

        const stats = await this._analyticsService.getTrackerStats(decoded.id, range as 'week' | 'month' | 'year');
        sendResponse(res, STATUS_CODES.OK,MESSAGES.TRACKER_STATUS_FETCHED, true, stats);
    }
}
