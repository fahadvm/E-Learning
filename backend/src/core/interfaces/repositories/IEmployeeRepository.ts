import { IEmployee } from '../../../models/Employee';

export interface IEmployeeRepository {
  create(employee: Partial<IEmployee>): Promise<IEmployee>;
  findByEmail(email: string): Promise<IEmployee | null>;
  updateByEmail(email: string, updateData: Partial<IEmployee>): Promise<IEmployee | null>;
  findAll(): Promise<IEmployee[]>;
  findById(employeeId: string): Promise<IEmployee | null>;
  findByCompanyId(companyId: string, skip: number, limit: number, search: string, sortField?: string, sortOrder?: string): Promise<IEmployee[]>;
  getEmployeesByCompany(companyId: string, skip: number, limit: number, search: string): Promise<IEmployee[]>;
  countEmployeesByCompany(companyId: string, search: string): Promise<number>;
  updateById(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null>;
  updateCancelRequestById(employeeId: string): Promise<IEmployee | null>;
  blockEmployee(employeeId: string, status: boolean): Promise<IEmployee | null>;
  findByGoogleId(googleId: string): Promise<IEmployee | null>;
  findCompanyByEmployeeId(employeeId: string): Promise<IEmployee | null>;
  findRequestedCompanyByEmployeeId(employeeId: string): Promise<IEmployee | null>;
  findRequestedEmployees(companyId: string): Promise<IEmployee[]>
  findEmployeeAndApprove(companyId: string, employeeId: string): Promise<IEmployee | null>
  findEmployeeAndReject(employeeId: string): Promise<IEmployee | null>
  assignCourseToEmployee(courseId: string, employeeId: string): Promise<void>
  getAssignedCourses(employeeId: string): Promise<IEmployee | null> 

}
