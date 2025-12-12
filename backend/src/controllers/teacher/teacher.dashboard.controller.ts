import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { ITeacherDashboardService } from "../../core/interfaces/services/teacher/ITeacherDashboardService";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";
import { AuthRequest } from "../../types/AuthenticatedRequest";

@injectable()
export class TeacherDashboardController {
    constructor(
        @inject(TYPES.TeacherDashboardService) private readonly _dashboardService: ITeacherDashboardService
    ) { }

    async getDashboardStats(req: AuthRequest, res: Response) {
        try {
            const teacherId = req.user?.id;
            if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

            const stats = await this._dashboardService.getDashboardStats(teacherId);
            sendResponse(res, STATUS_CODES.OK, "Dashboard stats fetched successfully", true, stats);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async getTopCourses(req: AuthRequest, res: Response) {
        try {
            const teacherId = req.user?.id;
            if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

            const courses = await this._dashboardService.getTopCourses(teacherId);
            sendResponse(res, STATUS_CODES.OK, "Top courses fetched successfully", true, courses);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async getEarningsGraph(req: AuthRequest, res: Response) {
        try {
            const teacherId = req.user?.id;
            if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

            const { timeframe } = req.query;
            const data = await this._dashboardService.getEarningsGraph(teacherId, timeframe as string);
            sendResponse(res, STATUS_CODES.OK, "Earnings graph fetched successfully", true, data);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async getUpcomingSchedule(req: AuthRequest, res: Response) {
        try {
            const teacherId = req.user?.id;
            if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

            const schedule = await this._dashboardService.getUpcomingSchedule(teacherId);
            sendResponse(res, STATUS_CODES.OK, "Schedule fetched successfully", true, schedule);
        } catch (error) {
            handleControllerError(res, error);
        }
    }
}
