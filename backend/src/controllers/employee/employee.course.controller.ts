import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { IEmployeeCourseService } from "../../core/interfaces/services/employee/IEmployeeCourseService";
import { AuthRequest } from "../../types/AuthenticatedRequest";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { MESSAGES } from "../../utils/ResponseMessages";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";

@injectable()
export class EmployeeCourseController {
    constructor(
        @inject(TYPES.EmployeeCourseService) private _employeeCourseService: IEmployeeCourseService
    ) { }

    async myCourses(req: AuthRequest, res: Response) {
        const employeeId = req.user?.id;
        if (!employeeId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST)
        const courses = await this._employeeCourseService.getMyCourses(employeeId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, courses)
    }

    async myCourseDetails(req: AuthRequest, res: Response) {
        const employeeId = req.user?.id;

        if (!employeeId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST)
        const { courseId } = req.params;

        const course = await this._employeeCourseService.getMyCourseDetails(employeeId,courseId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, course)
    }
}
