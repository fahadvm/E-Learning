import { Response } from "express";
import { AuthRequest } from "../../../../types/AuthenticatedRequest";

export interface ITeacherEarningsController {
    getEarningsHistory(req: AuthRequest, res: Response): Promise<void>;
    getEarningsStats(req: AuthRequest, res: Response): Promise<void>;
}
