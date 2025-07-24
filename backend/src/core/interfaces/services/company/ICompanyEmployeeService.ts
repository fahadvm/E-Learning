
export interface ICompanyEmployeeService {
  addEmployee(data: {
    companyId: string;
    name: string;
    email: string;
    password?: string;
    position?:string
    coursesAssigned?: string[];
  }): Promise<any>;

  getAllEmployees(companyId: string, page: number, limit: number): Promise<any[]>;

  getEmployeeById(employeeId: string): Promise<any | null>;

  blockEmployee(id: string, status: boolean): Promise<void>;

}
