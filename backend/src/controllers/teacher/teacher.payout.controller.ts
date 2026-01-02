import { Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/di/types';
import { ITeacherPayoutService } from '../../core/interfaces/services/teacher/ITeacherPayoutService';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { AuthRequest } from '../../types/AuthenticatedRequest';

@injectable()
export class TeacherPayoutController {
    constructor(
        @inject(TYPES.TeacherPayoutService) private readonly _payoutService: ITeacherPayoutService
    ) { }

    async getWalletStats(req: AuthRequest, res: Response) {
        const teacherId = req.user?.id;
        const stats = await this._payoutService.getWalletStats(teacherId!);
        sendResponse(res, STATUS_CODES.OK, 'Wallet stats fetched', true, stats);
    }

    async getPayoutHistory(req: AuthRequest, res: Response) {
        const teacherId = req.user?.id;
        const history = await this._payoutService.getPayoutHistory(teacherId!);
        sendResponse(res, STATUS_CODES.OK, 'Payout history fetched', true, history);
    }

    async requestPayout(req: AuthRequest, res: Response) {
        const teacherId = req.user?.id;
        const { amount, method, details } = req.body;

        if (!amount || !method || !details) throwError('Missing required fields', STATUS_CODES.BAD_REQUEST);

        const result = await this._payoutService.requestPayout(teacherId!, Number(amount), method, details);
        sendResponse(res, STATUS_CODES.OK, 'Payout requested successfully', true, result);
    }
}
