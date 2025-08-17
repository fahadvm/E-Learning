import { IEmployee } from '../../../../models/Employee';
export interface ICompanyEmployeeService {
  addEmployee(data: {
    companyId: string;
    name: string;
    email: string;
    password?: string;
    position?: string
    coursesAssigned?: string[];
  }): Promise<IEmployee>;

  getAllEmployees(
    companyId: string,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    sortOrder: string
  ): Promise<IEmployee[]>;

  getEmployeeById(employeeId: string): Promise<IEmployee | null>;

  blockEmployee(id: string, status: boolean): Promise<void>;
  updateEmployee(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null>;


}
