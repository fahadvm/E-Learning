import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IAdminEmployeeService } from '../../core/interfaces/services/admin/IAdminEmployeeService';
import { IEmployeeRepository } from '../../core/interfaces/repositories/employee/IEmployeeRepository';
import { IAdminEmployeeDTO, PaginatedEmployeeDTO, adminEmployeeDto } from '../../core/dtos/admin/Admin.employee.Dto';

@injectable()
export class AdminEmployeeService implements IAdminEmployeeService {
  constructor(
    @inject(TYPES.EmployeeRepository)
    private readonly _employeeRepo: IEmployeeRepository
  ) {}

  async getEmployeesByCompany(companyId: string, page: number, limit: number, search: string): Promise<PaginatedEmployeeDTO> {
    const employees = await this._employeeRepo.getEmployeesByCompany(companyId, page, limit, search);
    const total = await this._employeeRepo.countEmployeesByCompany(companyId, search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: employees.map(adminEmployeeDto),
      total,
      totalPages
    };
  }

  async getEmployeeById(employeeId: string): Promise<IAdminEmployeeDTO | null> {
    const employee = await this._employeeRepo.findById(employeeId);
    return employee ? adminEmployeeDto(employee) : null;
  }

  async blockEmployee(employeeId: string): Promise<IAdminEmployeeDTO | null> {
    const employee = await this._employeeRepo.blockEmployee(employeeId);
    return employee ? adminEmployeeDto(employee) : null;
  }

  async unblockEmployee(employeeId: string): Promise<IAdminEmployeeDTO | null> {
    const employee = await this._employeeRepo.unblockEmployee(employeeId);
    return employee ? adminEmployeeDto(employee) : null;
  }
}
