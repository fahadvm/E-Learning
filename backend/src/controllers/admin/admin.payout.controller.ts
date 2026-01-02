import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IAdminPayoutService } from '../../core/interfaces/services/admin/IAdminPayoutService';
import { sendResponse } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

@injectable()
export class AdminPayoutController {
    constructor(
        @inject(TYPES.AdminPayoutService) private readonly _payoutService: IAdminPayoutService
    ) { }

    async getAllPayouts(req: Request, res: Response) {
        const { status } = req.query;
        const payouts = await this._payoutService.getAllPayouts(status as string);
        sendResponse(res, STATUS_CODES.OK, 'Payouts fetched', true, payouts);
    }

    async approvePayout(req: Request, res: Response) {
        const { payoutId } = req.params;
        const result = await this._payoutService.approvePayout(payoutId);
        sendResponse(res, STATUS_CODES.OK, 'Payout approved', true, result);
    }

    async rejectPayout(req: Request, res: Response) {
        const { payoutId } = req.params;
        const { reason } = req.body;
        const result = await this._payoutService.rejectPayout(payoutId, reason);
        sendResponse(res, STATUS_CODES.OK, 'Payout rejected', true, result);
    }
}
