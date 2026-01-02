
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { ITransactionAdminService } from '../../core/interfaces/services/admin/ITransactionAdminService';
import { sendResponse } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class TransactionAdminController {
    constructor(
        @inject(TYPES.TransactionAdminService) private _service: ITransactionAdminService
    ) { }

    getTransactions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this._service.getAllTransactions(req.query);
            return sendResponse(res, STATUS_CODES.OK,MESSAGES.TRANSACTION_FETCHED, true, data);
        } catch (error) {
            next(error);
        }
    };
}
