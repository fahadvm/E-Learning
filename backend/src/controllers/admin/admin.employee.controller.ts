import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/DI/types';
import { IAdminEmployeeService } from '../../core/interfaces/services/admin/IAdminEmployeeService';
import { Request, Response } from 'express';
import { sendResponse } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { validatePagination } from '../../utils/validatePagination';

@injectable()
export class AdminEmployeeController {
    constructor(
        @inject(TYPES.AdminEmployeeService)
        private readonly _employeeService: IAdminEmployeeService
    ) {}

    async getEmployeesByCompany(req: Request, res: Response): Promise<void> {
        const { companyId } = req.params;
        const { page = '1', limit = '10', search = '' } = req.query;

        const { pageNum, limitNum, error } = validatePagination(String(page), String(limit));
        if (error || pageNum === null || limitNum === null) {
            return sendResponse(res, STATUS_CODES.BAD_REQUEST, error, false);
        }

        const result = await this._employeeService.getEmployeesByCompany(
            companyId,
            pageNum,
            limitNum,
            String(search || '')
        );

        sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEES_FETCHED, true, result);
    }

    async getEmployeeById(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        const employee = await this._employeeService.getEmployeeById(employeeId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEE_DETAILS_FETCHED, true, employee);
    }

    async blockEmployee(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        const updatedEmployee = await this._employeeService.blockEmployee(employeeId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEE_BLOCKED, true, updatedEmployee);
    }

    async unblockEmployee(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        const updatedEmployee = await this._employeeService.unblockEmployee(employeeId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.EMPLOYEE_UNBLOCKED, true, updatedEmployee);
    }
}
