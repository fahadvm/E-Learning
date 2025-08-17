import { IEmployee } from '../../../../models/Employee';

export interface IAdminEmployeeService {
    getEmployeesByCompany(companyId: string, page: number, limit: number, search: string): Promise<{ employees: IEmployee[], total: number }>;
    getEmployeeById(employeeId: string): Promise<IEmployee | null>;
    blockEmployee(employeeId: string): Promise<IEmployee | null>;
    unblockEmployee(employeeId: string): Promise<IEmployee | null>;
}
