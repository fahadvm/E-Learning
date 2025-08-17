// services/company/CompanyEmployeeService.ts

import { inject, injectable } from 'inversify';
import { ICompanyEmployeeService } from '../../core/interfaces/services/company/ICompanyEmployeeService';
import { ICompanyEmployeeRepository } from '../../core/interfaces/repositories/employee/ICompanyEmployeeRepository';
import bcrypt from 'bcryptjs';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { generateOtp, sendOtpEmail, } from '../../utils/OtpServices';
import { IEmployee } from '../../models/Employee';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';


@injectable()
export class CompanyEmployeeService implements ICompanyEmployeeService {
    constructor(
        @inject(TYPES.CompanyEmployeeRepository) private _employeeRepo: ICompanyEmployeeRepository
    ) { }

    async addEmployee(data: {
        companyId: string;
        name: string;
        email: string;
        password?: string;
        coursesAssigned?: string[];
        position: string;
    }): Promise<any> {


        console.log('data:', data);
        const existing = await this._employeeRepo.findByEmail(data.email);
        if (existing) {
            throwError('Employee already exists', STATUS_CODES.CONFLICT);
        }

        const tempPassword = 'Temp@' + generateOtp();
        console.log(`new employee added email :${data.email} & password :${tempPassword}`);

        const hashedPassword = tempPassword
            ? await bcrypt.hash(tempPassword, 10)
            : undefined;

        const newEmployee = await this._employeeRepo.create({
            ...data,
            password: hashedPassword,
        });
        await sendOtpEmail(data.email, tempPassword);
        return newEmployee;
    }
    async getAllEmployees(companyId: string, page: number, limit: number, search: string, sortBy: string, sortOrder: string): Promise<any[]> {
        const skip = (page - 1) * limit;
        return await this._employeeRepo.findByCompanyId(companyId, skip, limit, search, sortBy, sortOrder);
    }

    async getEmployeeById(employeeId: string): Promise<any | null> {
        return await this._employeeRepo.findById(employeeId);
    }

    async blockEmployee(id: string, status: boolean): Promise<void> {
        const employee = await this._employeeRepo.findById(id);
        if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        await this._employeeRepo.blockEmployee(id, status);
    }


    async updateEmployee(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
        return await this._employeeRepo.updateEmployeeById(employeeId, data);
    }


}
