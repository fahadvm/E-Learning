import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { ICompanyLeaderboardService } from "../../core/interfaces/services/company/ICompanyLeaderboardService";
import { AuthRequest } from "../../types/AuthenticatedRequest";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";

@injectable()
export class CompanyLeaderboardController {
    constructor(
        @inject(TYPES.CompanyLeaderboardService)
        private readonly _leaderboardService: ICompanyLeaderboardService
    ) { }

    async getLeaderboard(req: AuthRequest, res: Response) {

        const companyId = req.user?.id
        console.log("getting controller of  leaderboard ")
        if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        const leaderboard = await this._leaderboardService.getTop50(companyId);
        console.log("top 50 leaderboard ", leaderboard)
        return sendResponse(res, 200, "SUCCESS", true, { leaderboard });
    }

    async search(req: AuthRequest, res: Response) {
        console.log("search controller of  leaderboard ")
        const companyId = req.user?.id
        if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        const { name } = req.query as { name: string };
        const result = await this._leaderboardService.searchEmployee(companyId, name);
        return sendResponse(res, 200, "SUCCESS", true, result);
    }
}
