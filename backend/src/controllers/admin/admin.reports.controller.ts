
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { IAdminReportsService } from "../../core/interfaces/services/admin/IAdminReportsService";
import { sendResponse } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";

@injectable()
export class AdminReportsController {
    constructor(
        @inject(TYPES.AdminReportsService) private _service: IAdminReportsService
    ) { }

    getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
        const data = await this._service.getDashboardStats();
        return sendResponse(res, STATUS_CODES.OK, MESSAGES.DASHBOARD_STATS_FETCHED, true, data);
    };
}
