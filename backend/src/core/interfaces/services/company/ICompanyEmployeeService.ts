import { IEmployee } from '../../../../models/Employee';
import { PaginatedEmployeeDTO } from '../../../../core/dtos/company/company.employee.Dto';

export interface ICompanyEmployeeService {
  // addEmployee(data: {
  //   companyId: string;
  //   name: string;
  //   email: string;
  //   password?: string;
  //   position?: string
  //   coursesAssigned?: string[];
  // }): Promise<IEmployee>;

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
  updateEmployee(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null>;
  requestedEmployees(companyId: string): Promise<IEmployee[] | null>;
  approvingEmployee(companyId: string , employeeId :string ): Promise<IEmployee | null>
  rejectingEmployee(companyId: string): Promise<IEmployee | null>

}
