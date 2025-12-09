
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { IAdminReportsService } from "../../core/interfaces/services/admin/IAdminReportsService";
import { sendResponse } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";

@injectable()
export class AdminReportsController {
    constructor(
        @inject(TYPES.AdminReportsService) private _service: IAdminReportsService
    ) { }

    getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this._service.getDashboardStats();
            return sendResponse(res, STATUS_CODES.OK, "Dashboard stats fetched successfully", true, data);
        } catch (error) {
            next(error);
        }
    };
}
