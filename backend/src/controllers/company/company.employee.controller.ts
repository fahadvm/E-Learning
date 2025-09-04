import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ICompanyEmployeeService } from '../../core/interfaces/services/company/ICompanyEmployeeService';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { TYPES } from '../../core/di/types';
import { MESSAGES } from '../../utils/ResponseMessages';
import { ICompanyEmployeeController } from '../../core/interfaces/controllers/company/ICompanyEmployeeController';

@injectable()
export class CompanyEmployeeController implements ICompanyEmployeeController {
  constructor(
    @inject(TYPES.CompanyEmployeeService)
    private readonly _employeeService: ICompanyEmployeeService
  ) {}

  async addEmployee(req: Request, res: Response): Promise<void> {
    const { companyId, name, email, coursesAssigned, position } = req.body;
    if (!companyId || !name || !email) {
      throwError(MESSAGES.ALL_FIELDS_REQUIRED, STATUS_CODES.BAD_REQUEST);
    }

    const employee = await this._employeeService.addEmployee({
      companyId,name,email,coursesAssigned,position,});
    sendResponse(res, STATUS_CODES.CREATED, MESSAGES.EMPLOYEE_CREATED, true, employee);
  }

  async getAllEmployees(req: Request, res: Response): Promise<void> { 
    const { page = '1', limit = '10', search = '', sortBy = 'name', sortOrder = 'desc' } = req.query;
   
    const companyId = req.user?.id;
    if (!companyId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const employees = await this._employeeService.getAllEmployees(
      companyId,Number(page),Number(limit),String(search),String(sortBy),String(sortOrder)
    );
    sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEES_FETCHED, true, employees);
  }

  async getEmployeeById(req: Request, res: Response): Promise<void> {
    const {employeeId} = req.params;
    if (!employeeId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const employee = await this._employeeService.getEmployeeById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEE_DETAILS_FETCHED, true, employee);
  }

  async blockEmployee(req: Request, res: Response): Promise<void> {
    const { employeeId } = req.params;
    const { status } = req.body;

    const employee = await this._employeeService.blockEmployee(employeeId, status);
    sendResponse(res,STATUS_CODES.OK,status ? MESSAGES.EMPLOYEE_BLOCKED : MESSAGES.EMPLOYEE_UNBLOCKED,true,employee);}

  async updateEmployee(req: Request, res: Response): Promise<void> {
    const employeeId = req.params.employeeId;
    if (!employeeId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const { name, email, position } = req.body;
    const updatedEmployee = await this._employeeService.updateEmployee(employeeId, { name, email, position });
    sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEE_UPDATED, true, updatedEmployee);
  }
}
