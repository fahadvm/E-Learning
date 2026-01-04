import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IAdminEmployeeService } from '../../core/interfaces/services/admin/IAdminEmployeeService';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';
import { IEmployeeLearningPathProgressRepository } from '../../core/interfaces/repositories/IEmployeeLearningPathProgressRepository';
import { IAdminEmployeeDTO, PaginatedEmployeeDTO, adminEmployeeDto } from '../../core/dtos/admin/Admin.employee.Dto';

@injectable()
export class AdminEmployeeService implements IAdminEmployeeService {
  constructor(
    @inject(TYPES.EmployeeRepository)
    private readonly _employeeRepo: IEmployeeRepository,

    @inject(TYPES.EmployeeLearningPathProgressRepository)
    private readonly _lpProgressRepo: IEmployeeLearningPathProgressRepository
  ) { }

  async getEmployeesByCompany(companyId: string, page: number, limit: number, search: string): Promise<PaginatedEmployeeDTO> {
    const employees = await this._employeeRepo.getEmployeesByCompany(companyId, (page - 1) * limit, limit, search);
    const total = await this._employeeRepo.countEmployeesByCompany(companyId, search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: employees.map(adminEmployeeDto),
      total,
      totalPages
    };
  }

  async getAllEmployees(page: number, limit: number, search: string, status?: string): Promise<PaginatedEmployeeDTO> {
    const skip = (page - 1) * limit;
    const employees = await this._employeeRepo.findAllPaginated(skip, limit, search, status);
    const total = await this._employeeRepo.countAll(search, status);
    const totalPages = Math.ceil(total / limit);

    return {
      data: employees.map(adminEmployeeDto),
      total,
      totalPages
    };
  }

  async getEmployeeById(employeeId: string): Promise<IAdminEmployeeDTO | null> {
    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) return null;

    const dto = adminEmployeeDto(employee);

    // Fetch learning path progress
    const lpProgress = await this._lpProgressRepo.getAssigned(employeeId);
    dto.learningPaths = lpProgress.map(lp => ({
      _id: (lp.learningPathId as any)?._id?.toString() || lp.learningPathId.toString(),
      title: (lp.learningPathId as any)?.title || "Unknown Learning Path",
      percentage: lp.percentage,
      status: lp.status
    }));

    return dto;
  }

  async blockEmployee(employeeId: string): Promise<IAdminEmployeeDTO | null> {
    const employee = await this._employeeRepo.blockEmployee(employeeId, true);
    return employee ? adminEmployeeDto(employee) : null;
  }

  async unblockEmployee(employeeId: string): Promise<IAdminEmployeeDTO | null> {
    const employee = await this._employeeRepo.blockEmployee(employeeId, false);
    return employee ? adminEmployeeDto(employee) : null;
  }
}
