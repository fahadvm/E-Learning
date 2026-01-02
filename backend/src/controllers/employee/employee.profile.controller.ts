import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IEmployeeProfileService } from '../../core/interfaces/services/employee/IEmployeeProfileService';
import { TYPES } from '../../core/di/types';
import { decodeToken } from '../../utils/JWTtoken';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { IEmployeeProfileController } from '../../core/interfaces/controllers/employee/IEmployeeProfileController';
import { AuthRequest } from '../../types/AuthenticatedRequest';

@injectable()
export class EmployeeProfileController implements IEmployeeProfileController{
  constructor(
    @inject(TYPES.EmployeeProfileService)
    private readonly _employeeProfileService: IEmployeeProfileService
  ) {}

  getProfile = async (req: Request, res: Response) => {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const employee = await this._employeeProfileService.getProfile(decoded.id);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEE_DETAILS_FETCHED, true, employee);
  };

  editProfile = async (req: AuthRequest, res: Response) => {
    const employeeId = req.user?.id;
    if (!employeeId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const updated = await this._employeeProfileService.updateEmployeeProfile(employeeId, req.body);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PROFILE_UPDATED, true, updated);
  };
}
