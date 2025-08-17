import { IAdminEmployeeDTO, PaginatedEmployeeDTO,  } from '../../../../core/dtos/admin/Admin.employee.Dto';


export interface IAdminEmployeeService {
    getEmployeesByCompany(companyId: string, page: number, limit: number, search: string):Promise<PaginatedEmployeeDTO>;
    getEmployeeById(employeeId: string): Promise<IAdminEmployeeDTO | null>;
    blockEmployee(employeeId: string): Promise<IAdminEmployeeDTO | null>;
    unblockEmployee(employeeId: string): Promise<IAdminEmployeeDTO | null>;
}
