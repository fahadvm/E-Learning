import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IEmployeeProfileService } from '../../core/interfaces/services/employee/IEmployeeProfileService';
import { TYPES } from '../../core/di/types';
import { decodeToken } from '../../utils/JWTtoken';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { IEmployeeProfileController } from '../../core/interfaces/controllers/employee/IEmployeeProfileController';

@injectable()
export class EmployeeProfileController implements IEmployeeProfileController{
  constructor(
    @inject(TYPES.EmployeeProfileService)
    private readonly _employeeProfileService: IEmployeeProfileService
  ) {}

  getProfile = async (req: Request, res: Response) => {
    console.log("getting profile of employee")
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const employee = await this._employeeProfileService.getProfile(decoded.id);
    if (!employee) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.STUDENT_DETAILS_FETCHED, true, employee);
  };

  editProfile = async (req: Request, res: Response) => {
    const decoded = decodeToken(req.cookies.token);
    if (!decoded?.id) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const updated = await this._employeeProfileService.updateEmployeeProfile(decoded.id, req.body);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PROFILE_UPDATED, true, updated);
  };
}
