// services/company/CompanyEmployeeService.ts

import { inject, injectable } from 'inversify';
import { ICompanyEmployeeService } from '../../core/interfaces/services/company/ICompanyEmployeeService';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';
import bcrypt from 'bcryptjs';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { generateOtp, sendOtpEmail, } from '../../utils/OtpServices';
import { IEmployee } from '../../models/Employee';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { PaginatedEmployeeDTO, companyEmployeeDto } from '../../core/dtos/company/company.employee.Dto';


@injectable()
export class CompanyEmployeeService implements ICompanyEmployeeService {
    constructor(
        @inject(TYPES.EmployeeRepository) private _employeeRepo: IEmployeeRepository
    ) { }

    
    async getAllEmployees(companyId: string, page: number, limit: number, search: string, sortBy: string, sortOrder: string ): Promise<PaginatedEmployeeDTO> {
        const total = await this._employeeRepo.countEmployeesByCompany(companyId, search);
        const skip = (page - 1) * limit;
        const employees = await this._employeeRepo.findByCompanyId(companyId, skip, limit, search, sortBy, sortOrder);
        const totalPages = Math.ceil(total / limit);
        return {
            employees: employees.map(companyEmployeeDto),
            total,
            totalPages,
        };
    }

    async getEmployeeById(employeeId: string): Promise<any | null> {
        return await this._employeeRepo.findById(employeeId);
    }

    async blockEmployee(id: string, status: boolean): Promise<void> {
        const employee = await this._employeeRepo.blockEmployee(id, status);
        if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        await this._employeeRepo.blockEmployee(id, status);
    }


    async updateEmployee(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
        return await this._employeeRepo.updateById(employeeId, data);
    }

    async requestedEmployees(companyId: string): Promise<IEmployee[] | null> {
        const courses = await this._employeeRepo.findRequestedEmployees(companyId)
        return courses
    }

    async approvingEmployee(companyId: string , employeeId :string ): Promise<IEmployee | null> {
        const courses = await this._employeeRepo.findEmployeeAndApprove(companyId , employeeId)
        return courses
    }

    async rejectingEmployee(companyId: string): Promise<IEmployee | null> {
        const courses = await this._employeeRepo.findEmployeeAndReject(companyId)
        return courses
    }


}
