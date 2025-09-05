import { IEmployee } from '../../../models/Employee';

export interface IEmployeeRepository {
  create(data: {
    name: string;
    email: string;
    companyId: string;
    password?: string;
    coursesAssigned?: string[];
    position?: string;
  }): Promise<IEmployee>;

  findByEmail(email: string): Promise<IEmployee | null>;

  findAll(): Promise<IEmployee[]>;

  findById(employeeId: string): Promise<IEmployee | null>;

  findByCompanyId(
    companyId: string,
    skip: number,
    limit: number,
    search: string,
    sortField?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<IEmployee[]>;

  getEmployeesByCompany(
    companyId: string,
    skip: number,
    limit: number,
    search: string
  ): Promise<IEmployee[]>;

  countEmployeesByCompany(companyId: string, search: string): Promise<number>;

  updateEmployeeById(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null>;

  blockEmployee(employeeId: string, status: boolean): Promise<IEmployee | null>;
}
