import { Response } from "express";
import { AuthRequest } from "../../../../types/AuthenticatedRequest";

export interface IEmployeeTeacherController {
    getProfile(req: AuthRequest, res: Response): Promise<void>;
    getTopTeachers(req: AuthRequest, res: Response): Promise<void>;
}
