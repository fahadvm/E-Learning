import { IEmployee } from "../../../../models/Employee";
import { PaginatedEmployeeDTO } from "../../../dtos/company/company.employee.Dto";

export interface ICompanyEmployeeService {
  getAllEmployees(
    companyId: string,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    sortOrder: string
  ): Promise<PaginatedEmployeeDTO>;

  getEmployeeById(employeeId: string): Promise<IEmployee | null>;

  blockEmployee(id: string, status: boolean): Promise<void>;

  updateEmployee(
    employeeId: string,
    data: Partial<IEmployee>
  ): Promise<IEmployee | null>;

  requestedEmployees(companyId: string): Promise<IEmployee[] | null>;

  approvingEmployee(
    companyId: string,
    employeeId: string
  ): Promise<IEmployee | null>;

  rejectingEmployee(
    employeeId: string,
    reason: string
  ): Promise<IEmployee | null>;

  inviteEmployee(companyId: string, email: string): Promise<IEmployee | null>;

  searchEmployees(query: string): Promise<IEmployee[]>;

  removeEmployee(companyId: string, employeeId: string): Promise<void>;
}
