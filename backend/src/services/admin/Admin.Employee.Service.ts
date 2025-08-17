import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/DI/types';
import { IAdminEmployeeService } from '../../core/interfaces/services/admin/IAdminEmployeeService';
import { IEmployeeRepository } from '../../core/interfaces/repositories/employee/IEmployeeRepository';
import { IEmployee } from '../../models/Employee';

@injectable()
export class AdminEmployeeService implements IAdminEmployeeService {
    constructor(
        @inject(TYPES.EmployeeRepository)
        private readonly _employeeRepo: IEmployeeRepository
    ) {}

    async getEmployeesByCompany(companyId: string, page: number, limit: number, search: string): Promise<{ employees: IEmployee[], total: number }> {
        const employees = await this._employeeRepo.getEmployeesByCompany(companyId, page, limit, search);
        const total = await this._employeeRepo.countEmployeesByCompany(companyId, search);
        return { employees, total };
    }

    async getEmployeeById(employeeId: string): Promise<IEmployee | null> {
        return this._employeeRepo.findById(employeeId);
    }

    async blockEmployee(employeeId: string): Promise<IEmployee | null> {
        return this._employeeRepo.blockEmployee(employeeId);
    }

    async unblockEmployee(employeeId: string): Promise<IEmployee | null> {
        return this._employeeRepo.unblockEmployee(employeeId);
    }
}
