import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { ICompanyEmployeeService } from '../../core/interfaces/services/company/ICompanyEmployeeService';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { TYPES } from '../../core/di/types';
import { MESSAGES } from '../../utils/ResponseMessages';
import { ICompanyEmployeeController } from '../../core/interfaces/controllers/company/ICompanyEmployeeController';
import { AuthRequest } from '../../types/AuthenticatedRequest';

@injectable()
export class CompanyEmployeeController implements ICompanyEmployeeController {
  constructor(
    @inject(TYPES.CompanyEmployeeService)
    private readonly _employeeService: ICompanyEmployeeService
  ) { }

  async getAllEmployees(req: AuthRequest, res: Response): Promise<void> {
    const { page = '1', limit = '10', search = '', sortBy = 'name', sortOrder = 'desc', department, position } = req.query;
    const companyId = req.user?.id;
    if (!companyId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const employees = await this._employeeService.getAllEmployees(
      companyId, Number(page), Number(limit), String(search), String(sortBy), String(sortOrder), department ? String(department) : undefined, position ? String(position) : undefined
    );
    sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEES_FETCHED, true, employees);
  }

  async getEmployeeById(req: AuthRequest, res: Response): Promise<void> {
    const { employeeId } = req.params;
    if (!employeeId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const employee = await this._employeeService.getEmployeeById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEE_DETAILS_FETCHED, true, employee);
  }

  async blockEmployee(req: AuthRequest, res: Response): Promise<void> {
    const { employeeId } = req.params;
    const { status } = req.body;

    const employee = await this._employeeService.blockEmployee(employeeId, status);
    sendResponse(res, STATUS_CODES.OK, status ? MESSAGES.EMPLOYEE_BLOCKED : MESSAGES.EMPLOYEE_UNBLOCKED, true, employee);
  }

  async updateEmployee(req: AuthRequest, res: Response): Promise<void> {
    const employeeId = req.params.employeeId;
    if (!employeeId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const { position, department, location } = req.body;
    const updatedEmployee = await this._employeeService.updateEmployee(employeeId, { position, department, location });
    sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEE_UPDATED, true, updatedEmployee);
  }

  async getRequestedEmployees(req: AuthRequest, res: Response): Promise<void> {
    const companyId = req.user?.id;
    if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const employees = await this._employeeService.requestedEmployees(companyId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.REQUESTED_EMPLOYEES_FETCHED, true, employees);
  }

  async approveEmployee(req: AuthRequest, res: Response): Promise<void> {
    const companyId = req.user?.id;
    const employeeId = req.params.employeeId;

    if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const employees = await this._employeeService.approvingEmployee(companyId, employeeId);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEE_REQUEST_APPROVED, true, employees);
  }

  async rejectEmployee(req: AuthRequest, res: Response): Promise<void> {
    const employeeId = req.params.employeeId;
    const { reason } = req.body;

    if (!employeeId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
    if (!reason) throwError(MESSAGES.REJECTION_REASON_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const employee = await this._employeeService.rejectingEmployee(employeeId, reason);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEE_REQUEST_REJECTED, true, employee);
  }

  async inviteEmployee(req: AuthRequest, res: Response): Promise<void> {
    const companyId = req.user?.id;
    const { email } = req.body;

    if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    if (!email) throwError(MESSAGES.EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const employee = await this._employeeService.inviteEmployee(companyId, email);

    if (employee) {
      sendResponse(res, STATUS_CODES.OK, MESSAGES.INVITATION_SENT, true, employee);
    } else {
      sendResponse(res, STATUS_CODES.OK, MESSAGES.INVITE_LINK_CREATED, true, { email });
    }
  }

  async searchEmployees(req: AuthRequest, res: Response): Promise<void> {
    const { query } = req.query;

    if (!query) throwError('Search query is required', STATUS_CODES.BAD_REQUEST);

    const employees = await this._employeeService.searchEmployees(String(query));
    sendResponse(res, STATUS_CODES.OK, 'Employees found', true, employees);
  }

  async removeEmployee(req: AuthRequest, res: Response): Promise<void> {
    const companyId = req.user?.id;
    const { employeeId } = req.params;

    if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    if (!employeeId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    await this._employeeService.removeEmployee(companyId, employeeId);
    sendResponse(res, STATUS_CODES.OK, 'Employee removed from company', true, null);
  }

  async getEmployeeProgress(req: AuthRequest, res: Response): Promise<void> {
    const { employeeId } = req.params;
    if (!employeeId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const progress = await this._employeeService.getEmployeeProgress(employeeId);
    sendResponse(res, STATUS_CODES.OK, 'Employee progress fetched', true, progress);
  }

}
